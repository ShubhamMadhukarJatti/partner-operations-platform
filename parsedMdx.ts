// lib/parseMdx.ts
import { serialize } from 'next-mdx-remote/serialize'

export async function parseMdx(source: string) {
  return await serialize(source)
}
