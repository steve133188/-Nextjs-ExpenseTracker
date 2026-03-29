import { sqliteTable, text, real } from "drizzle-orm/sqlite-core"

// database table schema
export const expenses = sqliteTable("expenses", {
  id:          text("id").primaryKey(),
  title:       text("title").notNull(),
  amount:      real("amount").notNull(),
  category:    text("category").notNull(),
  date:        text("date").notNull(),
  description: text("description").default(""),
})
