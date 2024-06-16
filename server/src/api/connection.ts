import { Elysia, t } from "elysia"
import { kitPlugin } from "@/api"
import { MessageProcessor } from "@/processor"


// this could be anything. A channel is needed to enable the pubsub pattern
const wsChannelName = "communication"

export const connectionApi = (app: Elysia) => app
  .use(kitPlugin)
  .state("processor", new MessageProcessor())
  .ws("/socket", {
    body: t.String(),
    open: (ws) => {
      // TODO: only let people who authenticate connect
      ws.subscribe(wsChannelName)
      ws.data.store.processor.addClient(ws.id)
    },
    message: (ws, message) => {
      const processor = ws.data.store.processor
      const newMessage = processor.processMessage(ws.data.store.kit, message, ws.id)

      if (newMessage === null) {
        return
      }

      // you would think that publish would send it to every subscriber, but it sends it to every subscriber but the current client
      ws.send(newMessage)
      ws.publish(wsChannelName, newMessage)
    },
    close: (ws) => {
      // not sure if this is necessary but it can't hurt
      ws.unsubscribe(wsChannelName)
      ws.data.store.processor.removeClient(ws.id)
    }
  })
