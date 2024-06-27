import { Elysia, t } from "elysia"
import { kitPlugin } from "@/api"
import { type ChannelRow, type MessageRow } from "@/db/schema"
import { None, type Maybe } from ".."
import { getAllChannels, getChannel, getLastMessagesInChannel } from "@/db/channels"


export const channelsApi = (app: Elysia) => app
  .use(kitPlugin)
  .get("/channels/:id", async (ctx): Promise<Maybe<ChannelRow>> => {
    return getChannel(ctx.store.kit, ctx.params.id)
  }, {
    params: t.Object({
      id: t.String()
    })
  })
  .get("/channels", async (ctx): Promise<Maybe<ChannelRow[]>> => {
    return getAllChannels(ctx.store.kit)
  })
  .get("/channels/:id/messages", async (ctx): Promise<Maybe<MessageRow[]>> => {
    const { config } = ctx.store.kit
    let last = parseInt(ctx.query.last)
    let before = parseInt(ctx.query.before)

    if (last > config.maxMessages()) {
      ctx.set.status = 400
      return None("last parameter is too large")
    }

    // TODO: this won't scale. We have to sort through the entire table to get the last N messages.
    // I don't actually know how sql really works
    // chaching is probably necessary
    return await getLastMessagesInChannel(ctx.store.kit, ctx.params.id, last, before)
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
