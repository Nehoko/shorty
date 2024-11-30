import { Database } from "./Database.ts"
import { UrlDto } from "./model/UrlDto.ts"
import { toHash } from "./stringUtils.ts"

export class ShortyService {
  private readonly shortUrlLength = Number(
    Deno.env.get("SHORT_URL_MAX_LENGTH") ?? 7,
  )
  private readonly maxRetries = Number(Deno.env.get("MAX_RETRIES") ?? 5)

  constructor(private readonly database: Database) {}

  public async create(url: string, key?: string): Promise<UrlDto> {
    if (url === undefined) {
      throw Error("URL must be defined")
    }
    let shortUrl = key ?? await toHash(url, this.shortUrlLength)
    let count = 0
    let success = false
    while (!success && count++ < this.maxRetries) {
      success = await this.database.add(shortUrl, url)
      if (success) {
        break
      }
      shortUrl = await toHash(shortUrl, this.shortUrlLength)
    }
    if (count >= this.maxRetries) {
      throw Error(
        `Service tried to save short url ${count} times, but reached the limit: ${this.maxRetries}`,
      )
    }
    return { shortUrl, url }
  }

  public async delete(key: string): Promise<void> {
    if (key === undefined) {
      throw Error("Key must be defined")
    }
    let count = 0
    let success = false
    while (!success && count++ < this.maxRetries) {
      success = await this.database.remove(key)
    }
    if (count >= this.maxRetries) {
      throw Error(
        `Service tried to delete short url ${count} times, but reached the limit: ${this.maxRetries}`,
      )
    }
  }

  public async get(key: string): Promise<string | null> {
    return await this.database.read(key)
  }
}
