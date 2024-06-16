import type { Kit } from "@/index"

// right now the ws just echos back
export class MessageProcessor {
  private clients: string[] = []

  addClient(clientId: string) {
    this.clients.push(clientId)
  }

  removeClient(clientId: string) {
    // TODO
  }

  processMessage(kit: Kit, message: string, senderId: string): string {
    return message
  }

}

