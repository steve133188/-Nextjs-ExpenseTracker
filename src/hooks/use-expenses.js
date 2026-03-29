"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const QUERY_KEY = ["expenses"]

function buildUrl(filters = {}) {
  const params = new URLSearchParams()
  ;(filters.categories ?? []).forEach((cat) => params.append("category", cat))
  if (filters.from) params.set("from", filters.from)
  if (filters.to)   params.set("to",   filters.to)
  const qs = params.toString()
  return qs ? `/api/expenses?${qs}` : "/api/expenses"
}

async function fetchExpenses(filters) {
  const res = await fetch(buildUrl(filters))
  if (!res.ok) throw new Error("Failed to fetch expenses")
  return res.json()
}

export function useExpenses(filters = {}) {
  return useQuery({
    queryKey: [...QUERY_KEY, filters],
    queryFn: () => fetchExpenses(filters),
    enabled: !!(filters.from && filters.to),
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to create expense")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success("Expense added")
    },
    onError: (err) => toast.error(err.message),
  })
}

export function useUpdateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to update expense")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success("Expense updated")
    },
    onError: (err) => toast.error(err.message),
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete expense")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success("Expense deleted")
    },
    onError: (err) => toast.error(err.message),
  })
}
