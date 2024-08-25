import type { Kit } from ".."
import {
  channelTable,
  messageTable,
  type ChannelRow,
  type MessageRow
} from "./schema"
import { Some, None, type Maybe } from "maybe"
import { and, eq, lte } from "drizzle-orm"
import { generateIdFromEntropySize } from "lucia"

// export function addChannel(kit: Kit, channel: ) {
//
// }

export async function getChannel(
  kit: Kit,
  channelId: string
): Promise<Maybe<ChannelRow>> {
  try {
    const channels = await kit.db
      .select()
      .from(channelTable)
      .where(eq(channelTable.id, channelId))
    return Some(channels[0])
  } catch (e) {
    return None(`database error while fetching channel: ${e}`)
  }
}

export function validateChannelName(name: string): boolean {
  // more than 0 characters
  // less than 50 characters
  // only a-z A-Z 0-9 _ - .
  return /^[a-zA-Z0-9_.-]{1,50}$/.test(name)
}

export async function getLastMessagesInChannel(
  kit: Kit,
  channelId: string,
  last: number,
  before: number
): Promise<Maybe<MessageRow[]>> {
  try {
    const messsages = await kit.db
      .select()
      .from(messageTable)
      .where(
        and(
          eq(messageTable.channelId, channelId),
          lte(messageTable.createdAt, before)
        )
      )
      .orderBy(messageTable.createdAt)
      .limit(last)
    return Some(messsages)
  } catch (e) {
    return None(`database error while fetching messages: ${e}`)
  }
}

export async function getAllChannels(kit: Kit): Promise<Maybe<ChannelRow[]>> {
  try {
    const channels = await kit.db.select().from(channelTable)
    return Some(channels)
  } catch (e) {
    return None(`database error while fetching channels: ${e}`)
  }
}

export async function makeChannel(
  kit: Kit,
  name: string,
  description: string
): Promise<Maybe<ChannelRow>> {
  try {
    const channel = {
      id: generateIdFromEntropySize(32),
      name,
      description,
      createdAt: Date.now()
    }

    await kit.db.insert(channelTable).values(channel)

    return Some(channel)
  } catch (e) {
    return None(`database error while creating channel: ${e}`)
  }
}


export async function deleteChannel(
  kit: Kit,
  id: string,
): Promise<boolean> {
  try {
    const result = await kit.db.delete(channelTable).where(eq(channelTable.id, id)).returning()
    const messagesResult = await kit.db.delete(messageTable).where(eq(messageTable.channelId, id)).returning()
    return result.length > 0 && messagesResult.length > 0
  } catch (e) {
    return false
  }
}


export async function modifyChannel(
  kit: Kit,
  id: string,
  newChannel: Omit<ChannelRow, "createdAt" | "id">
): Promise<boolean> {
  try {
    const result = await kit.db.update(channelTable).set(newChannel).where(eq(channelTable.id, id)).returning()
    return result.length > 0
  } catch (e) {
    return false
  }
}
