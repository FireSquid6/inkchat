// contains frequently used functions for testing
import { getDb } from "./db";
import { getAuth } from "./auth";
import type { App } from "./index";
import { Config } from "@/config";
import { treaty } from "@elysiajs/eden";
import { startEphemeralApp } from "./setups";
import { sessionTable, userTable } from "./schema";
import { faker } from "@faker-js/faker";

export interface TestKit {
  db: ReturnType<typeof getDb>
  auth: ReturnType<typeof getAuth>
  config: Config
  api: ReturnType<typeof treaty<App>>
}

export function testApp(): TestKit {
  const stdKit = startEphemeralApp()
  const api = treaty<App>("http://localhost:3001")

  return {
    db: stdKit.db,
    auth: stdKit.auth,
    config: stdKit.config,
    api,
  }
}


export async function getTestUser(db: ReturnType<typeof getDb>) {
  const user = {
    username: "testuser",
    password: "T3stp@ssword",
    id: faker.string.uuid(),
  }
  await db.insert(userTable).values(user)
  const session = {
    id: faker.string.uuid(),
    userId: user.id,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
  }
  await db.insert(sessionTable).values(session)

  return {
    user,
    session
  }
}

// Note: this function assumes that nothing is sent whenever the socket is first opened
export async function converse(socket: WebSocket, messages: string[]): Promise<string[]> {
  return new Promise(async (resolve) => {
    const responses: string[] = []

    for (const message of messages) {
      const response = await sendAndWait(socket, message)
      responses.push(response)
    }

    return resolve(responses)
  })

}

export function sendAndWait(socket: WebSocket, message: string): Promise<string> {
  return new Promise((resolve) => {
    socket.send(message)
    socket.onmessage = (event) => {
      resolve(event.data.toString())
    }
  })
}
