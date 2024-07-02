import { app } from "@server/api"
import { treaty } from "@elysiajs/eden"


export function getTreaty(url: string) {
  const api = treaty<typeof app>(url)
}
