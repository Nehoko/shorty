import { Application, isHttpError } from "@oak/oak"
import { initRouter } from "./src/router.ts"

const app = new Application()
const router = await initRouter()
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    if (isHttpError(error)) {
      ctx.response.status = error.status
      ctx.response.body = { ...error }
    } else {
      ctx.response.status = 500
      ctx.response.body = { error }
    }
    console.error(error)
  }
})
app.use(router.routes())
app.use(router.allowedMethods())
app.addEventListener("listen", ({ hostname, port, secure }) => {
  const localhost = "localhost"
  if (hostname === "0.0.0.0") {
    hostname = localhost
  }
  console.log(
    `Listening on: ${secure ? "https://" : "http://"}${
      hostname ?? localhost
    }:${port}`,
  )
})
await app.listen({ port: 1337 })
