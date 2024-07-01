import { treaty } from "@elysiajs/eden"
import type { App } from "inkchat-server"


export function connectToServer(url: string) {
  const api = treaty<App>(url)
}
