import { Elysia, t } from "elysia"
import { kitPlugin } from "."
import path from "node:path"
import fs from "node:fs"

export const filesApi = (app: Elysia) => app
  .use(kitPlugin)
  .get("/keep/*", async (ctx) => {
    ctx.set.status = 501
    return "Not Implemented"
  })
  .post("/keep/*", async (ctx) => {
    ctx.set.status = 501
    return "Not Implemented"
  })
  .put("/keep/*", async (ctx) => {
    ctx.set.status = 501
    return "Not Implemented"
  })
  .post("/attachments", async (ctx) => {
    if (!fs.existsSync(path.join(ctx.store.kit.config.storeDir(), "attachments"))) {
      fs.mkdirSync(path.join(ctx.store.kit.config.storeDir(), "attachments"))
    }

    const randomStuff = Math.random().toString(36).substring(7)
    const newFilename = `${randomStuff}-${ctx.body.filename}`
    const newFilepath = path.join(ctx.store.kit.config.storeDir(), "attachments", newFilename)

    try {
      fs.writeFileSync(newFilepath, await ctx.body.file.text())
    } catch (e) {
      console.error(e)
      ctx.set.status = 500
      return ""
    }

    ctx.set.status = 201
    return newFilename
  }, {
    body: t.Object({
      filename: t.String(),
      file: t.File(),
    })
  })
  .get("/attachments/:filename", async (ctx) => {
    const { config } = ctx.store.kit
    const filepath = path.join(config.storeDir(), "attachments", ctx.params.filename)
    const file = Bun.file(filepath)

    if (!file.exists()) {
      ctx.set.status = 404
      return null
    }

    ctx.set.status = 200
    return file
  })
  .get("/avatars/:username", async (ctx) => {
    ctx.set.status = 501
    return "Not implemented"
  })
