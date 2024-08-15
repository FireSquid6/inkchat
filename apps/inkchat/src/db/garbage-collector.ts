import type { Kit } from "@/index"
import { lt } from "drizzle-orm"
import { joincodeTable, sessionTable } from "@/db/schema"


export function collectGarbage(kit: Kit) {
  const { db } = kit
  
  // delete expired joincodes
  db.delete(joincodeTable).where(lt(joincodeTable.expiresAt, Date.now()))
  db.delete(sessionTable).where(lt(sessionTable.expiresAt, Date.now()))
}
