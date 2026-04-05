/**
 * seed-db.js
 * Populates the database with realistic sample expenses across Jan – Apr 2026,
 * covering all 9 categories so charts and period filters are meaningful on first load.
 * Run with: npm run db:seed
 *
 * Safe to re-run — clears existing data before inserting.
 */
import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { expenses } from "../src/lib/schema.js"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, "..", "data", "expenses.db")

const sqlite = new Database(dbPath)
const db = drizzle(sqlite)
// Total 34 records
const SEED_DATA = [
  // January 2026
  { title: "Monthly rent",         amount: 1500.00, category: "Housing",          date: "2026-01-01", description: "" },
  { title: "Grocery shopping",     amount: 87.50,   category: "Food & Dining",    date: "2026-01-03", description: "Weekly groceries" },
  { title: "Bus pass",             amount: 45.00,   category: "Transportation",   date: "2026-01-06", description: "Monthly transit pass" },
  { title: "Gym membership",       amount: 55.00,   category: "Health & Medical", date: "2026-01-06", description: "New Year resolution" },
  { title: "Dinner with friends",  amount: 62.00,   category: "Food & Dining",    date: "2026-01-10", description: "Italian restaurant" },
  { title: "New headphones",       amount: 129.99,  category: "Shopping",         date: "2026-01-15", description: "Sony WH-1000XM5" },
  { title: "Textbooks",            amount: 210.00,  category: "Education",        date: "2026-01-17", description: "Semester textbooks" },
  { title: "Movie night",          amount: 28.00,   category: "Entertainment",    date: "2026-01-20", description: "Tickets + popcorn" },
  { title: "Coffee subscription",  amount: 18.00,   category: "Food & Dining",    date: "2026-01-22", description: "Monthly coffee beans" },
  { title: "Electricity bill",     amount: 74.30,   category: "Housing",          date: "2026-01-28", description: "Cold month" },
  // February 2026
  { title: "Monthly rent",         amount: 1500.00, category: "Housing",          date: "2026-02-01", description: "" },
  { title: "Grocery shopping",     amount: 91.20,   category: "Food & Dining",    date: "2026-02-02", description: "Weekly groceries" },
  { title: "Bus pass",             amount: 45.00,   category: "Transportation",   date: "2026-02-04", description: "Monthly transit pass" },
  { title: "Gym membership",       amount: 55.00,   category: "Health & Medical", date: "2026-02-04", description: "" },
  { title: "Valentine's dinner",   amount: 95.00,   category: "Food & Dining",    date: "2026-02-14", description: "Special occasion" },
  { title: "Doctor visit",         amount: 50.00,   category: "Health & Medical", date: "2026-02-16", description: "General checkup" },
  { title: "Winter jacket",        amount: 189.00,  category: "Shopping",         date: "2026-02-18", description: "On sale 30% off" },
  { title: "Online course",        amount: 79.00,   category: "Education",        date: "2026-02-20", description: "React advanced" },
  { title: "Concert tickets",      amount: 110.00,  category: "Entertainment",    date: "2026-02-22", description: "Live music event" },
  { title: "Internet bill",        amount: 59.99,   category: "Housing",          date: "2026-02-26", description: "" },
  // March 2026
  { title: "Monthly rent",         amount: 1500.00, category: "Housing",          date: "2026-03-01", description: "" },
  { title: "Grocery shopping",     amount: 78.40,   category: "Food & Dining",    date: "2026-03-03", description: "Weekly groceries" },
  { title: "Bus pass",             amount: 45.00,   category: "Transportation",   date: "2026-03-04", description: "Monthly transit pass" },
  { title: "Gym membership",       amount: 55.00,   category: "Health & Medical", date: "2026-03-04", description: "" },
  { title: "Flight home",          amount: 320.00,  category: "Travel",           date: "2026-03-07", description: "Return flight for break" },
  { title: "Hotel stay",           amount: 240.00,  category: "Travel",           date: "2026-03-08", description: "2 nights" },
  { title: "Lunch at work",        amount: 54.00,   category: "Food & Dining",    date: "2026-03-11", description: "5 days of lunch" },
  { title: "Fuel",                 amount: 65.00,   category: "Transportation",   date: "2026-03-14", description: "Full tank" },
  { title: "Spotify + Netflix",    amount: 28.98,   category: "Entertainment",    date: "2026-03-16", description: "Monthly subscriptions" },
  { title: "Running shoes",        amount: 149.00,  category: "Shopping",         date: "2026-03-19", description: "Nike Pegasus" },
  // April 2026
  { title: "Monthly rent",         amount: 1500.00, category: "Housing",          date: "2026-04-01", description: "" },
  { title: "Grocery shopping",     amount: 76.30,   category: "Food & Dining",    date: "2026-04-02", description: "Weekly groceries" },
  { title: "Bus pass",             amount: 45.00,   category: "Transportation",   date: "2026-04-03", description: "Monthly transit pass" },
  { title: "Coffee & snacks",      amount: 12.50,   category: "Food & Dining",    date: "2026-04-05", description: "Study session" },
]

// Clear existing data then insert seed records
db.delete(expenses).run()

for (let i = 0; i < SEED_DATA.length; i++) {
  const record = SEED_DATA[i]
  // Stagger createdAt: noon of the expense date + i minutes so same-day ordering is stable
  const createdAt = new Date(record.date + "T12:00:00").getTime() + i * 60_000
  db.insert(expenses).values({ id: crypto.randomUUID(), createdAt, ...record }).run()
}

sqlite.close()
console.log(`✓ Seeded ${SEED_DATA.length} expenses across 4 months (Jan – Apr 2026).`)
