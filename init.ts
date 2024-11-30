import { Database } from "./src/Database.ts"
import { ShortyService } from "./src/ShortyService.ts"

export const initApp = async () => {
  const database = new Database()
  await database.init()
  const shortyService = new ShortyService(database)

  return { database, shortyService }
}
