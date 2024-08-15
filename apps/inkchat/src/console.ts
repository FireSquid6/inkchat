import { isNone } from "maybe"
import { Kit } from "."
import { makeJoincode } from "./db/auth"
import { getUserWithUsername, promoteUser } from "./db/user"
import { collectGarbage } from "./db/garbage-collector"

export async function listenToConsole(kit: Kit) {
  for await (const line of console) {
    const words = line.split(" ")

    if (words.length === 0) {
      continue
    }
    const command = words[0]
    const args = new Map<string, string>()
    for (let i = 1; i < words.length; i++) {
      const parts = words[i].split("=")

      if (parts.length !== 2) {
        console.log("Invalid argument:", words[i])
        continue
      }

      args.set(parts[0], parts[1])
    }

    if (commands[command]) {
      console.log("")
      commands[command](kit, args)
      console.log("")
    } else {
      console.log("Unknown command:", command)
    }
  }
}

type ConsoleCommand = (kit: Kit, args: Map<string, string>) => void

const commands: Record<string, ConsoleCommand> = {
  help: () => {
    console.log("Available commands:")
    console.log(Object.keys(commands).join(", "))
  },
  joincode: async (kit) => {
    console.log("Creating a new joincode")
    const code = await makeJoincode(kit)

    if (isNone(code)) {
      console.error("Failed to create joincode:", code.error)
    }

    console.log("Joincode:", code.data)
  },
  makeAdmin: async (kit, args) => {
    const user = args.get("user")

    if (!user) {
      console.log("No user provided. Provide one with user=<username>")
      return
    }

    const maybe = await getUserWithUsername(kit, user)
    
    if (isNone(maybe)) {
      console.error("Failed to get user:", maybe.error)
      return
    }

    const res = await promoteUser(kit, maybe.data.id)

    if (res.error) {
      console.error("Failed to promote user:", res.error)
      return
    }

    console.log(`Promoted ${user} to admin`)
  },
  gc: async (kit) => {
    await collectGarbage(kit)
  }
}
