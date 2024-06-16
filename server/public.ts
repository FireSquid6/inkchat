// the server package is depended on directly by the client for eden treaties and such
// this file is where everything is exported directly
export type { App } from "@/index"
export * as ServerMessageProtocol from "@/protocol/server"
export * as Protocol from "@/protocol"
export * as ClientMessageProtocol from "@/protocol/client"

