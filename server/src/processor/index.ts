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

  // TODO: better error handling. If it's an error, we should only send the response message to the client that sent it
  processMessage(kit: Kit, message: string, senderId: string): { response: string, error: string }{
    // if the sender has not been authenticated or connected, just return nothing 
    return { response: message, error: ""}
  }

}

