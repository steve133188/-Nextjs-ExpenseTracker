import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { expenses } from "@/lib/schema"
import { expenseSchema } from "@/lib/validations"

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const row = db.select().from(expenses).where(eq(expenses.id, id)).get()
    if (!row) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }
    return NextResponse.json(row)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const result = expenseSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
    }
    const updated = db
      .update(expenses)
      .set(result.data)
      .where(eq(expenses.id, id))
      .returning()
      .get() // CRUD - Update
    if (!updated) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const deleted = db
      .delete(expenses)
      .where(eq(expenses.id, id))
      .returning()
      .get() // CRUD - Delete
    if (!deleted) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
