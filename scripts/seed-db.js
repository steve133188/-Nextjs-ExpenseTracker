/**
 * seed-db.js
 * Populates the database with 12 months of realistic sample expenses (Apr 2025 – Mar 2026)
 * covering all 9 categories, so charts and period comparisons are meaningful on first load.
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

const SEED_DATA = [
  { title: "Monthly rent",         amount: 1500.00, category: "Housing",          date: "2025-04-01", description: "" },
  { title: "Grocery shopping",     amount: 82.40,   category: "Food & Dining",    date: "2025-04-03", description: "Weekly groceries" },
  { title: "Bus pass",             amount: 45.00,   category: "Transportation",   date: "2025-04-04", description: "Monthly transit pass" },
  { title: "Gym membership",       amount: 55.00,   category: "Health & Medical", date: "2025-04-05", description: "" },
  { title: "Dinner out",           amount: 48.50,   category: "Food & Dining",    date: "2025-04-09", description: "Thai restaurant" },
  { title: "New sneakers",         amount: 115.00,  category: "Shopping",         date: "2025-04-12", description: "Running shoes" },
  { title: "Movie night",          amount: 24.00,   category: "Entertainment",    date: "2025-04-15", description: "Cinema + snacks" },
  { title: "Internet bill",        amount: 59.99,   category: "Housing",          date: "2025-04-18", description: "" },
  { title: "Pharmacy",             amount: 28.00,   category: "Health & Medical", date: "2025-04-21", description: "Vitamins" },
  { title: "Uber rides",           amount: 32.00,   category: "Transportation",   date: "2025-04-25", description: "Weekend trips" },
  { title: "Monthly rent",         amount: 1500.00, category: "Housing",          date: "2025-05-01", description: "" },
  { title: "Grocery shopping",     amount: 94.10,   category: "Food & Dining",    date: "2025-05-02", description: "Weekly groceries" },
  { title: "Bus pass",             amount: 45.00,   category: "Transportation",   date: "2025-05-04", description: "Monthly transit pass" },
  { title: "Gym membership",       amount: 55.00,   category: "Health & Medical", date: "2025-05-05", description: "" },
  { title: "Birthday dinner",      amount: 76.00,   category: "Food & Dining",    date: "2025-05-10", description: "Friend's birthday" },
  { title: "Online course",        amount: 49.00,   category: "Education",        date: "2025-05-13", description: "Python basics" },
  { title: "Summer clothes",       amount: 138.00,  category: "Shopping",         date: "2025-05-17", description: "T-shirts and shorts" },
  { title: "Concert tickets",      amount: 85.00,   category: "Entertainment",    date: "2025-05-22", description: "Indie band" },
  { title: "Electricity bill",     amount: 68.40,   category: "Housing",          date: "2025-05-27", description: "" },
  { title: "Doctor visit",         amount: 50.00,   category: "Health & Medical", date: "2025-05-29", description: "General checkup" },
  { title: "Monthly rent",         amount: 1500.00, category: "Housing",          date: "2025-06-01", description: "" },
  { title: "Grocery shopping",     amount: 88.70,   category: "Food & Dining",    date: "2025-06-03", description: "Weekly groceries" },
  { title: "Flight to Vancouver",  amount: 280.00,  category: "Travel",           date: "2025-06-06", description: "Return flight" },
  { title: "Hotel (3 nights)",     amount: 360.00,  category: "Travel",           date: "2025-06-07", description: "Downtown hotel" },
  { title: "Bus pass",             amount: 45.00,   category: "Transportation",   date: "2025-06-09", description: "Monthly transit pass" },
  { title: "Gym membership",       amount: 55.00,   category: "Health & Medical", date: "2025-06-09", description: "" },
  { title: "Restaurants (trip)",   amount: 120.00,  category: "Food & Dining",    date: "2025-06-10", description: "Various meals during trip" },
  { title: "Souvenirs",            amount: 65.00,   category: "Shopping",         date: "2025-06-12", description: "" },
  { title: "Streaming services",   amount: 28.98,   category: "Entertainment",    date: "2025-06-15", description: "Netflix + Spotify" },
  { title: "Internet bill",        amount: 59.99,   category: "Housing",          date: "2025-06-18", description: "" },
  { title: "Monthly rent",         amount: 1500.00, category: "Housing",          date: "2025-07-01", description: "" },
  { title: "Grocery shopping",     amount: 79.50,   category: "Food & Dining",    date: "2025-07-03", description: "Weekly groceries" },
  { title: "Bus pass",             amount: 45.00,   category: "Transportation",   date: "2025-07-07", description: "Monthly transit pass" },
  { title: "Gym membership",       amount: 55.00,   category: "Health & Medical", date: "2025-07-07", description: "" },
  { title: "BBQ supplies",         amount: 54.00,   category: "Food & Dining",    date: "2025-07-12", description: "Canada Day BBQ" },
  { title: "Water park tickets",   amount: 95.00,   category: "Entertainment",    date: "2025-07-19", description: "Family outing" },
  { title: "Sunscreen & gear",     amount: 42.00,   category: "Shopping",         date: "2025-07-21", description: "" },
  { title: "Fuel",                 amount: 68.00,   category: "Transportation",   date: "2025-07-24", description: "Road trip" },
  { title: "Electricity bill",     amount: 72.10,   category: "Housing",          date: "2025-07-27", description: "Higher due to AC" },
  { title: "Physio session",       amount: 90.00,   category: "Health & Medical", date: "2025-07-30", description: "Knee rehab" },
  { title: "Monthly rent",         amount: 1500.00, category: "Housing",          date: "2025-08-01", description: "" },
  { title: "Grocery shopping",     amount: 85.20,   category: "Food & Dining",    date: "2025-08-04", description: "Weekly groceries" },
  { title: "Bus pass",             amount: 45.00,   category: "Transportation",   date: "2025-08-06", description: "Monthly transit pass" },
  { title: "Gym membership",       amount: 55.00,   category: "Health & Medical", date: "2025-08-06", description: "" },
  { title: "Back-to-school books", amount: 195.00,  category: "Education",        date: "2025-08-11", description: "Textbooks for fall" },
  { title: "Laptop bag",           amount: 79.00,   category: "Shopping",         date: "2025-08-14", description: "" },
  { title: "Dinner with family",   amount: 110.00,  category: "Food & Dining",    date: "2025-08-16", description: "Long weekend dinner" },
  { title: "Gaming subscription",  amount: 18.99,   category: "Entertainment",    date: "2025-08-20", description: "Xbox Game Pass" },
  { title: "Internet bill",        amount: 59.99,   category: "Housing",          date: "2025-08-22", description: "" },
  { title: "Eye exam",             amount: 110.00,  category: "Health & Medical", date: "2025-08-28", description: "Annual exam + glasses" },
  { title: "Monthly rent",         amount: 1500.00, category: "Housing",          date: "2025-09-01", description: "" },
  { title: "Grocery shopping",     amount: 92.60,   category: "Food & Dining",    date: "2025-09-03", description: "Weekly groceries" },
  { title: "Bus pass",             amount: 45.00,   category: "Transportation",   date: "2025-09-05", description: "Monthly transit pass" },
  { title: "Gym membership",       amount: 55.00,   category: "Health & Medical", date: "2025-09-05", description: "" },
  { title: "University tuition",   amount: 3200.00, category: "Education",        date: "2025-09-08", description: "Fall semester" },
  { title: "New jeans",            amount: 89.00,   category: "Shopping",         date: "2025-09-12", description: "" },
  { title: "Lunch at campus",      amount: 56.00,   category: "Food & Dining",    date: "2025-09-15", description: "5 days lunches" },
  { title: "Cinema",               amount: 22.00,   category: "Entertainment",    date: "2025-09-19", description: "New release" },
  { title: "Electricity bill",     amount: 65.30,   category: "Housing",          date: "2025-09-25", description: "" },
  { title: "Pharmacy",             amount: 35.00,   category: "Health & Medical", date: "2025-09-28", description: "Flu shot + meds" },
  { title: "Monthly rent",         amount: 1500.00, category: "Housing",          date: "2025-10-01", description: "" },
  { title: "Grocery shopping",     amount: 96.80,   category: "Food & Dining",    date: "2025-10-02", description: "Weekly groceries" },
  { title: "Bus pass",             amount: 45.00,   category: "Transportation",   date: "2025-10-06", description: "Monthly transit pass" },
  { title: "Gym membership",       amount: 55.00,   category: "Health & Medical", date: "2025-10-06", description: "" },
  { title: "Thanksgiving dinner",  amount: 130.00,  category: "Food & Dining",    date: "2025-10-13", description: "Groceries for feast" },
  { title: "Halloween costume",    amount: 55.00,   category: "Shopping",         date: "2025-10-20", description: "" },
  { title: "Hackathon ticket",     amount: 30.00,   category: "Education",        date: "2025-10-22", description: "" },
  { title: "Haunted house",        amount: 38.00,   category: "Entertainment",    date: "2025-10-26", description: "" },
  { title: "Internet bill",        amount: 59.99,   category: "Housing",          date: "2025-10-28", description: "" },
  { title: "Uber rides",           amount: 44.00,   category: "Transportation",   date: "2025-10-31", description: "Halloween night" },
  { title: "Monthly rent",         amount: 1500.00, category: "Housing",          date: "2025-11-01", description: "" },
  { title: "Grocery shopping",     amount: 88.10,   category: "Food & Dining",    date: "2025-11-03", description: "Weekly groceries" },
  { title: "Bus pass",             amount: 45.00,   category: "Transportation",   date: "2025-11-05", description: "Monthly transit pass" },
  { title: "Gym membership",       amount: 55.00,   category: "Health & Medical", date: "2025-11-05", description: "" },
  { title: "Black Friday — TV",    amount: 649.00,  category: "Shopping",         date: "2025-11-28", description: "65\" 4K TV on sale" },
  { title: "Black Friday — games", amount: 89.97,   category: "Entertainment",    date: "2025-11-28", description: "3 Steam games" },
  { title: "Winter boots",         amount: 175.00,  category: "Shopping",         date: "2025-11-20", description: "Waterproof boots" },
  { title: "Dentist",              amount: 180.00,  category: "Health & Medical", date: "2025-11-14", description: "Cleaning + x-ray" },
  { title: "Electricity bill",     amount: 78.50,   category: "Housing",          date: "2025-11-26", description: "Heating season starts" },
  { title: "Coffee & snacks",      amount: 34.00,   category: "Food & Dining",    date: "2025-11-18", description: "Study sessions" },
  { title: "Monthly rent",         amount: 1500.00, category: "Housing",          date: "2025-12-01", description: "" },
  { title: "Grocery shopping",     amount: 102.30,  category: "Food & Dining",    date: "2025-12-03", description: "Weekly groceries" },
  { title: "Bus pass",             amount: 45.00,   category: "Transportation",   date: "2025-12-05", description: "Monthly transit pass" },
  { title: "Gym membership",       amount: 55.00,   category: "Health & Medical", date: "2025-12-05", description: "" },
  { title: "Christmas gifts",      amount: 420.00,  category: "Shopping",         date: "2025-12-12", description: "Family + friends" },
  { title: "Christmas dinner",     amount: 185.00,  category: "Food & Dining",    date: "2025-12-25", description: "Groceries + wine" },
  { title: "Holiday flight",       amount: 450.00,  category: "Travel",           date: "2025-12-20", description: "Return home for holidays" },
  { title: "New Year Eve party",   amount: 95.00,   category: "Entertainment",    date: "2025-12-31", description: "Tickets + drinks" },
  { title: "Internet bill",        amount: 59.99,   category: "Housing",          date: "2025-12-18", description: "" },
  { title: "Pharmacy",             amount: 42.00,   category: "Health & Medical", date: "2025-12-08", description: "Cold & flu season" },
  { title: "Monthly rent",         amount: 1500.00, category: "Housing",          date: "2026-01-01", description: "" },
  { title: "Grocery shopping",     amount: 87.50,   category: "Food & Dining",    date: "2026-01-03", description: "Weekly groceries" },
  { title: "Bus pass",             amount: 45.00,   category: "Transportation",   date: "2026-01-06", description: "Monthly transit pass" },
  { title: "Gym membership",       amount: 55.00,   category: "Health & Medical", date: "2026-01-06", description: "New Year resolution" },
  { title: "Dinner with friends",  amount: 62.00,   category: "Food & Dining",    date: "2026-01-10", description: "Italian restaurant" },
  { title: "New headphones",       amount: 129.99,  category: "Shopping",         date: "2026-01-15", description: "Sony WH-1000XM5" },
  { title: "Textbooks",            amount: 210.00,  category: "Education",        date: "2026-01-17", description: "Semester textbooks" },
  { title: "Movie night",          amount: 28.00,   category: "Entertainment",    date: "2026-01-20", description: "Tickets + popcorn" },
  { title: "Electricity bill",     amount: 74.30,   category: "Housing",          date: "2026-01-28", description: "Cold month" },
  { title: "Coffee subscription",  amount: 18.00,   category: "Food & Dining",    date: "2026-01-22", description: "Monthly coffee beans" },
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
]

// Clear existing data then insert seed records
db.delete(expenses).run()

for (const record of SEED_DATA) {
  db.insert(expenses).values({ id: crypto.randomUUID(), ...record }).run()
}

sqlite.close()
console.log(`✓ Seeded ${SEED_DATA.length} expenses across 12 months.`)
