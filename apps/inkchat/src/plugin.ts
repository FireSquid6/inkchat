// it's expected that plugins are written in typescript and built through bun build. Ideally no dependencies or the dependencies are bundled into the plugin
import Elysia from "elysia"
import { Message } from "protocol"

// plugins should export a function like this as default
export type PluginBuilder = (pluginContext: PluginContext) => InkchatPlugin

export type PluginContext = {
  // TODO - should be:
  // - an sdk.Connection instance to make calls to the server
  // - a special authentication token
}

export type InkchatPlugin = {
  name: string
  extraFiles: string[]

  // pages: Page[]  // pages of extra ui the client should render
  // actions: Record<string, Action>  // actions that the ui can trigger

  agents: Agent[]
  routes: Elysia  // TODO: export kit plugin so that plugins can use it
}

export type Agent = {
  name: string
  profilePicturePath: string
  // TODO: provide some slash commands that the agend can respond to
  // the client should be able to get a list of agents and the commands they have

  onMessage(message: Message): void
}

