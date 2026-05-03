// src/db/schema.ts
import { mysqlTable, serial, int, varchar, text, timestamp, mysqlEnum } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  nama: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // bcrypt hash
});

export const tasks = mysqlTable("tasks", {
  id: serial("id").primaryKey(),
  userId: int("user_id").notNull().references(() => users.id),
  judul: varchar("judul", { length: 255 }).notNull(),
  description: text("description"),  // ← text, bukan varchar
  status: mysqlEnum("status", ["Belum", "Proses", "Selesai"]).notNull().default("Belum"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// relasi
export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));