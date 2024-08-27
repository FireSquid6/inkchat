// it's expected that plugins are written in typescript and built through bun build. Ideally no dependencies or the dependencies are bundled into the plugin
import Elysia from "elysia"
import { Message } from "protocol"
import { Kit } from "."

// plugins should export a function like this as default
export type PluginBuilder = (pluginContext: PluginContext) => InkchatPlugin

export type PluginContext = {
  token: string
  kit: Kit  // plugin can do special stuff with the kit to modify the database or send messages
}

export type InkchatPlugin = {
  name: string  // name should be unique to the plugin
  extraFiles: string[]  // extra files that the plugin needs to be served. Will be locaed at `/plugins/${name}/${file}`

  // pages: Page[]  // pages of extra ui the client should render
  // actions: Record<string, Action>  // actions that the ui can trigger

  agents: Agent[]
  routes: Elysia // TODO: export kit plugin so that plugins can use it
}

export type Agent = {
  name: string  // username of the agent
  profilePicturePath: string
  // TODO: provide some slash commands that the agend can respond to
  // the client should be able to get a list of agents and the commands they have
  onMessageRecieved(message: Message): Message | Message[] | void  // every message that the server receives will be passed through this function. If it returns a message, that message will be sent to the server instead. Otherwise, nothing will happen
  onMessageProcessed(message: Message): void  // called with the message that the server recieved from a client after the server has already processed it
  onMessageSent(message: Message): void  // called with the message that the server sent to a client
}


// TODO - plugin connection that allows plugins to do user stuff
