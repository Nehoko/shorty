export class Database {
  private _db?: Promise<Deno.Kv>
  private static readonly MAX_LIFETIME = Number(
    Deno.env.get("SHORT_URL_MAX_LIFETIME_IN_DAYS") ?? 365,
  ) * 24 * 60 * 60 * 1000

  constructor() {}

  public get db(): Promise<Deno.Kv> {
    if (this._db === undefined) {
      this._db = Deno.openKv("db/internal")
    }
    return this._db
  }

  public async add(key: string, value: string): Promise<boolean> {
    const db = await this.db
    if (key === undefined) {
      throw Error("Key must be defined")
    }
    const entry: Deno.KvEntryMaybe<string> = await db.get([key])
    const res = await db.atomic()
      .check(entry)
      .set([key], value, { expireIn: Date.now() + Database.MAX_LIFETIME })
      .commit()
    return res.ok
  }

  public async read(key: string): Promise<string | null> {
    const db = await this.db
    if (key === undefined) {
      throw Error("Key must be defined")
    }
    const entry: Deno.KvEntryMaybe<string> = await db.get([key])
    await this.refresh(entry)
    return entry.value
  }

  public async remove(key: string): Promise<boolean> {
    const db = await this.db
    const entry: Deno.KvEntryMaybe<string> = await db.get([key])
    const value = entry.value
    if (value === null) {
      throw Error(`Value on key ${key} is null`)
    }
    const res = await db.atomic()
      .check(entry)
      .delete([key])
      .commit()
    return res.ok
  }

  private async refresh(entry: Deno.KvEntryMaybe<string>): Promise<void> {
    const db = await this.db
    await db.set(entry.key, entry.value, {expireIn: Date.now() + Database.MAX_LIFETIME})
  }
}
