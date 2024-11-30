import { Database } from "./src/Database.ts"
import { ShortyService } from "./src/ShortyService.ts"

export const initApp = () => {
  const database = new Database()
  const shortyService = new ShortyService(database)

  return { database, shortyService }
}
