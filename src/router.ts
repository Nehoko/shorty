import { Router, Status } from "@oak/oak"
import { UrlDto } from "./model/UrlDto.ts"
import { initApp } from "../init.ts"

export const initRouter = async () => {
  const { shortyService } = await initApp()
  const router = new Router()

  router.get("/", (context) => {
    context.response.body = "Hello world!"
  })
  router.get("/:key", async (context) => {
    const key = context?.params?.key
    if (key === undefined) {
      throw Error("Key must be defined")
    }
    const redirectUrl = await shortyService.get(key)
    if (redirectUrl === null) {
      context.response.status = Status.NotFound
      return
    }
    context.response.redirect(redirectUrl)
  })
  router.delete("/:key", async (context) => {
    const key = context.params.item
    if (key === undefined) {
      throw Error("Key must be defined")
    }
    await shortyService.delete(key)
    context.response.status = Status.OK
  })
  router.post("/", async (context) => {
    if (!context.request.hasBody) {
      throw Error("Empty body.")
    }
    const urlDto: UrlDto = await context.request.body.json()
    context.response.body = await shortyService.create(
      urlDto.url,
      urlDto.shortUrl,
    )
    context.response.status = Status.Created
  })
  return router
}
