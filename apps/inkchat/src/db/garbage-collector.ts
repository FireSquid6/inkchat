import type { Kit } from "@/index"
import { lt } from "drizzle-orm"
import { joincodeTable, sessionTable } from "@/db/schema"


export async function collectGarbage(kit: Kit) {
  const { db } = kit
  
  // delete expired joincodes
  await db.delete(joincodeTable).where(lt(joincodeTable.expiresAt, Date.now()))
  await db.delete(sessionTable).where(lt(sessionTable.expiresAt, Date.now()))
}
