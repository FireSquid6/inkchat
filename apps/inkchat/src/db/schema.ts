import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type { InferSelectModel } from "drizzle-orm";

export const userTable = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  password: text("password").notNull(),
  username: text("username").unique().notNull(),
  isAdmin: integer("is_admin").notNull().default(0),
})
export type UserRow = InferSelectModel<typeof userTable>

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").notNull().references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
})
export type SessionRow = InferSelectModel<typeof sessionTable>

// messages are stored in plain text as markdown
export const messageTable = sqliteTable("message", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").notNull().references(() => userTable.id),
  content: text("content").notNull(),
  createdAt: integer("created_at").notNull(),
  channelId: text("channel_id").notNull().references(() => channelTable.id),
})
export type MessageRow = InferSelectModel<typeof messageTable>

export const channelTable = sqliteTable("channel", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdAt: integer("created_at").notNull(),
})
export type ChannelRow = InferSelectModel<typeof channelTable>

export const joincodeTable = sqliteTable("joincode", {
  id: text("id").notNull().primaryKey().unique(),
  isAdmin: integer("is_admin").notNull().default(0),
  createdAt: integer("created_at").notNull(),
})
export type JoincodeRow = InferSelectModel<typeof joincodeTable>
