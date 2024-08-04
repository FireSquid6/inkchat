import type { Kit } from "..";
import { channelTable, messageTable, type ChannelRow, type MessageRow } from "./schema";
import { Some, None, type Maybe } from "maybe";
import { and, eq, lte } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";

// export function addChannel(kit: Kit, channel: ) {
//
// }

export async function getChannel(kit: Kit, channelId: string): Promise<Maybe<ChannelRow>> {
  try {
    const channels = await kit.db.select().from(channelTable).where(eq(channelTable.id, channelId))
    return Some(channels[0])
  } catch (e) {
    return None(`database error while fetching channel: ${e}`)
  }
}


export async function getLastMessagesInChannel(kit: Kit, channelId: string, last: number, before: number): Promise<Maybe<MessageRow[]>> {
  try {
    const messsages = await kit.db
      .select()
      .from(messageTable)
      .where(and(eq(messageTable.channelId, channelId), lte(messageTable.createdAt, before)))
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

export async function makeChannel(kit: Kit, name: string, description: string): Promise<Maybe<ChannelRow>> {
  try {
    const channel = {
      id: generateIdFromEntropySize(32),
      name,
      description,
      createdAt: Date.now(),
    }

    await kit.db.insert(channelTable).values(channel)

    return Some(channel)
  } catch (e) {
    return None(`database error while creating channel: ${e}`)
  }
}
