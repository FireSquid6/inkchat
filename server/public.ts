import * as Protocol from "@/protocol"
import type { App } from "@/index"
import { treaty } from "@elysiajs/eden"

export {
  Protocol,
}

export function getTreaty(url: string) {
  return treaty<App>(url)
}
