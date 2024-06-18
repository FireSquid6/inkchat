import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const userTable = sqliteTable("user", {
  id: text("id").notNull().primaryKey(),
  password: text("password").notNull(),
  username: text("username").unique().notNull(),
})

export const sessionTable = sqliteTable("session", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").notNull().references(() => userTable.id),
  expiresAt: integer("expires_at").notNull(),
})


// messages are stored in plain text as markdown
export const messageTable = sqliteTable("message", {
  id: text("id").notNull().primaryKey(),
  userId: text("user_id").notNull().references(() => userTable.id),
  content: text("content").notNull(),
  createdAt: integer("created_at").notNull(),
  channelId: text("channel_id").notNull().references(() => channelTable.id),
})


export const channelTable = sqliteTable("channel", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdAt: integer("created_at").notNull(),
})