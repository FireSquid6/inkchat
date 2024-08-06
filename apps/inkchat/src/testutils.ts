// contains frequently used functions for testing
import { getDb } from "./db"
import { getAuth } from "@/db/auth"
import type { App } from "./index"
import { Config } from "@/config"
import { treaty } from "@elysiajs/eden"
import { startEphemeralApp } from "./setups"
import { sessionTable, userTable } from "@/db/schema"

export interface TestKit {
  db: ReturnType<typeof getDb>
  auth: ReturnType<typeof getAuth>
  config: Config
  api: ReturnType<typeof treaty<App>>
}

export function testApp(): TestKit {
  const stdKit = startEphemeralApp(false)
  const api = treaty<App>("http://localhost:3001")

  return {
    db: stdKit.db,
    auth: stdKit.auth,
    config: stdKit.config,
    api
  }
}

export async function getTestUser(db: ReturnType<typeof getDb>) {
  const user = {
    username: "testuser",
    password: "T3stp@ssword",
    id: "testuser",
    isAdmin: 1
  }
  await db.insert(userTable).values(user)
  const session = {
    id: "testsession",
    userId: user.id,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30
  }
  await db.insert(sessionTable).values(session)

  return {
    user,
    session
  }
}


export async function converse(
  // @ts-expect-error EdenWS is no longer exported from eden
  socket: Treaty.EdenWS<any>,
  messages: string[],
  waitFirst: boolean = false
): Promise<string[]> {
  return new Promise(async (resolve) => {
    const responses: string[] = []

    if (waitFirst) {
      const firstMessage = await waitForMessage(socket)
      responses.push(firstMessage)
    }

    for (const message of messages) {
      const response = await sendAndWait(socket, message)
      responses.push(response)
    }

    return resolve(responses)
  })
}

// @ts-expect-error EdenWS is no longer exported from eden
export function waitForMessage(socket: EdenWS): Promise<string> {
  return new Promise((resolve) => {
    // @ts-expect-error EdenWS is no longer exported from eden
    socket.on("message", (message) => {
      resolve(message.data as string)
    })
  })
}

// @ts-expect-error EdenWS is no longer exported from eden
export function sendAndWait(socket: EdenWS, message: string): Promise<string> {
  return new Promise((resolve) => {
    socket.send(message)
    // @ts-expect-error EdenWS is no longer exported from eden
    socket.on("message", (response) => {
      resolve(response.data as string)
    })
  })
}
