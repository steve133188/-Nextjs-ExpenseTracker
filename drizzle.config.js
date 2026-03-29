import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./src/lib/schema.js",
  dialect: "sqlite",
  dbCredentials: {
    url: "./data/expenses.db",
  },
})
