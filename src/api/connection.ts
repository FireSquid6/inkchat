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
    message: async (ws, message) => {
      const processor = ws.data.store.processor

      let response = ""
      let error = ""

      try {
        const data = await processor.processMessage(ws.data.store.kit, message, ws.id)
        response = data.response
        error = data.error
      } catch (e) {
        response = ""
        error = `Something went horribly wwrong: ${e as string}`
      }

      // you would think that publish would send it to every subscriber, but it sends it to every subscriber but the current client
      if (response != "") {
        ws.send(response)
        ws.publish(wsChannelName, response)
      }
      if (error != "") {
        ws.send(error)
      }
    },

    close: (ws) => {
      // not sure if this is necessary but it can't hurt
      ws.unsubscribe(wsChannelName)
      ws.data.store.processor.removeClient(ws.id)
    }
  })
