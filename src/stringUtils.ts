import { encodeHex } from "@std/encoding/hex"

const textEncoder = new TextEncoder()
const algorithm = "SHA-256"

export const toHash = async (
  input: string,
  length?: number,
): Promise<string> => {
  const buffer = textEncoder.encode(input)
  const hashBuffer = await crypto.subtle.digest(algorithm, buffer)
  const hash = encodeHex(hashBuffer)
  if (length === undefined) {
    return hash
  }
  return hash.slice(0, length)
}
