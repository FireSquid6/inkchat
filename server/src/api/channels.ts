import { Elysia, t } from "elysia"
import { kitPlugin } from "@/api"
import { type ChannelRow, type MessageRow } from "@/db/schema"
import { isNone } from ".."
import { getAllChannels, getChannel, getLastMessagesInChannel } from "@/db/channels"


export const channelsApi = (app: Elysia) => app
  .use(kitPlugin)
  .get("/channels/:id", async (ctx): Promise<ChannelRow | null> => {
    const channelResponse = await getChannel(ctx.store.kit, ctx.params.id)
    if (isNone(channelResponse)) {
      ctx.set.status = 404
      return null
    }

    ctx.set.status = 200
    return channelResponse.data
  }, {
    params: t.Object({
      id: t.String()
    })
  })
  .get("/channels", async (ctx): Promise<ChannelRow[]> => {
    const allChannels = await getAllChannels(ctx.store.kit)

    if (isNone(allChannels)) {
      ctx.set.status = 500
      return []
    }

    ctx.set.status = 200
    return allChannels.data
  })
  .get("/channels/:id/messages", async (ctx): Promise<MessageRow[]> => {
    const { config } = ctx.store.kit
    let last = parseInt(ctx.query.last)
    let before = parseInt(ctx.query.before)

    if (last > config.maxMessages()) {
      ctx.set.status = 400
      return []
    }

    // TODO: this won't scale. We have to sort through the entire table to get the last N messages.
    // I don't actually know how sql really works
    // chaching is probably necessary
    console.log(ctx.params.id)
    const messageRes = await getLastMessagesInChannel(ctx.store.kit, ctx.params.id, last, before)
    if (isNone(messageRes)) {
      ctx.set.status = 500
      return []
    }

    return messageRes.data
  }, {
    params: t.Object({
      id: t.String()
    }),
    // TODO: allow the client to filter based on before date/after date, sender, etc.
    query: t.Object({
      before: t.String(),
      last: t.String()
    })
  })
