import type { App } from "inkchat"
export * as Schema from "inkchat/src/db/schema"
import { treaty } from "@elysiajs/eden"

export function getTreaty(url: string) {
  return treaty<App>(url)
}

