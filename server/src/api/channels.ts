import { Elysia, t } from "elysia"
import { kitPlugin } from "@/api"
import { channelTable, messageTable } from "@/schema"
import { eq, and, gt } from "drizzle-orm"



export const chatApi = (app: Elysia) => app
  .use(kitPlugin)
  .get("/channels/:id", async (ctx) => {
    const { db } = ctx.store.kit
    const channels = await db.select().from(channelTable).where(eq(channelTable.id, ctx.params.id))

    if (channels.length === 0) {
      ctx.set.status = 404
      return {
        message: "Channel not found"
      }
    }

    return channels[0]
  }, {
    params: t.Object({
      id: t.String()
    })
  })
  .get("/channels", async (ctx) => {
    const { db } = ctx.store.kit
    const channels = await db.select().from(channelTable)
    return channels
  })
  .get("/channels/:id/messages", async (ctx) => {
    const { db } = ctx.store.kit
    let last = ctx.query.last ?? 50
    let before = ctx.query.before ?? Date.now()

    // TODO: make 200 a configurable value
    if (last > 200) {
      ctx.set.status = 400
      return {
        message: "Cannot request more than 200 messages at a time"
      }
    }

    // TODO: this won't scale. We have to sort through the entire table to get the last N messages.
    // I don't actually know how sql really works
    // chaching is probably necessary
    const messages = await db
      .select()
      .from(messageTable)
      .where(and(eq(messageTable.channelId, ctx.params.id), gt(messageTable.createdAt, before)))
      .orderBy(messageTable.createdAt)
      .limit(last)

    return messages
  }, {
    params: t.Object({
      id: t.String()
    }),
    // TODO: allow the client to filter based on before date/after date, sender, etc.
    query: t.Object({
      before: t.Optional(t.Number()),
      last: t.Optional(t.Number())
    })
  })
