"use client"

import { useState, useMemo, useEffect } from "react"
import { useDeleteExpense } from "@/hooks/use-expenses"

const PAGE_SIZE = 10

export function useExpenseTable(expenses) {
  const deleteExpense = useDeleteExpense()
  const [deletingId, setDeletingId] = useState(null)
  const [sortKey, setSortKey] = useState("date")
  const [sortDir, setSortDir] = useState("desc")
  const [page, setPage] = useState(1)

  // Reset to page 1 when expense list changes (e.g. filter applied)
  useEffect(() => setPage(1), [expenses])

  function handleSort(column) {
    if (sortKey === column) {
      setSortDir((d) => d === "asc" ? "desc" : "asc")
    } else {
      setSortKey(column)
      setSortDir("asc")
    }
    setPage(1)
  }

  const sorted = useMemo(() => {
    return [...expenses].sort((a, b) => {
      const aVal = sortKey === "amount" ? a.amount : a.date
      const bVal = sortKey === "amount" ? b.amount : b.date
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1
      // same date/amount: newer entry first
      return (b.createdAt ?? 0) - (a.createdAt ?? 0)
    })
  }, [expenses, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleDelete(id) {
    setDeletingId(id)
    deleteExpense.mutate(id, { onSettled: () => setDeletingId(null) })
  }

  return {
    paginated,
    page,
    setPage,
    totalPages,
    sortKey,
    sortDir,
    handleSort,
    deletingId,
    handleDelete,
    pageSize: PAGE_SIZE,
    totalCount: sorted.length,
  }
}
