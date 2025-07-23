import { pgTable, serial, varchar, integer, timestamp, numeric } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  whopUserId: varchar("whop_user_id", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 128 }),
  email: varchar("email", { length: 128 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  whopTransactionId: varchar("whop_transaction_id", { length: 64 }).notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  source: varchar("source", { length: 128 }),
  createdAt: timestamp("created_at").defaultNow(),
});
