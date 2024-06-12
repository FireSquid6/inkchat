import { App } from "server";
import { treaty } from "@elysiajs/eden"


export function getApi(url: string) {
  return treaty<App>(url)
}



