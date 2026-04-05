import { NextResponse } from "next/server"
import { and, inArray, gte, lte } from "drizzle-orm"
import { db } from "@/lib/db"
import { expenses } from "@/lib/schema"
import { expenseSchema } from "@/lib/validations"

// GET /api/expenses — supports ?category=X&from=YYYY-MM-DD&to=YYYY-MM-DD
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const categories = searchParams.getAll("category")
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    const conditions = []
    if (categories.length > 0) conditions.push(inArray(expenses.category, categories))
    if (from) conditions.push(gte(expenses.date, from))
    if (to)   conditions.push(lte(expenses.date, to))

    let query = db.select().from(expenses)
    if (conditions.length > 0) query = query.where(and(...conditions))
    const rows = query.all() // CRUD - Read

    return NextResponse.json(rows)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/expenses — validate body then insert with a new UUID
export async function POST(request) {
  try {
    const body = await request.json()
    const result = expenseSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
    }
    const newExpense = { id: crypto.randomUUID(), createdAt: Date.now(), ...result.data }
    db.insert(expenses).values(newExpense).run() // CRUD - Create
    return NextResponse.json(newExpense, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
