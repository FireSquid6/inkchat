// for whatever reason you need this or typescript doesn't know how to do types
export * as Schema from "inkchat/src/db/schema"
import type { UserRow, MessageRow, ChannelRow } from "inkchat/src/db/schema"
import type { PublicUser } from "inkchat/src/api/users"
import type { ServerInformation } from "inkchat/src/config"
export * as sdk from "inkchat/src/sdk"

export type { UserRow, MessageRow, ChannelRow, PublicUser, ServerInformation }
