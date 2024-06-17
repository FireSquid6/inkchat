import { Elysia, t } from "elysia"
import { kitPlugin } from "@/api"
import type { Kit } from "@/index"
import path from "path"



export const filesApi = (app: Elysia) => app
  .use(kitPlugin)
  .get("/avatars/:id", async (ctx) => {
    // TODO: if the file doesn't exist, return a placeholder image if the placeholder query is set
    const filepath = getAvatarPath(ctx.store.kit, ctx.params.id)
    const avatar = Bun.file(filepath)

    if (!avatar.exists()) {
      ctx.set.status = 404
      return {
        message: "File not found"
      }
    }

    ctx.set.status = 200
    return avatar
  }, {
    params: t.Object({
      id: t.String()
    }),
    query: t.Object({
      doPlaceholder: t.String(),
    })
  })
  .post("/avatars", async (ctx) => {
    if (ctx.user === null) {
      // this should be impossible
      // we handle it anyway because we know that we are bad programmers
      ctx.set.status = 401
      return {
        message: "Not logged in"
      }
    }

    const fileExtension = path.extname(ctx.body.name)
    if (fileExtension !== ".png") {
      ctx.set.status = 400
      return {
        message: "File must be a png"
      }
    }

    const newPath = getAvatarPath(ctx.store.kit, ctx.user.id)
    Bun.write(newPath, await ctx.body.text())

    ctx.set.status = 200
    return {
      message: "Avatar uploaded successfully"
    }
  }, {
    body: t.File()
  })
// TODO: creating attachments and getting a random filename
// TODO: custom filepaths in the keep directory


function getAvatarPath(kit: Kit, userId: string): string {
  return path.join(kit.config.storeDir(), "avatars", `${userId}.png`)
}
