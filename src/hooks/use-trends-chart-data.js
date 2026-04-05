"use client"

import { useMemo } from "react"
import {
  eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval,
  startOfWeek, format, parseISO,
} from "date-fns"
import { resolveGrouping, BAR_COLORS } from "@/lib/chart-utils"

export function useTrendsChartData(expenses, from, to, period) {
  return useMemo(() => {
    const grouping = resolveGrouping(period, from, to)

    // Bucket expenses by day / week-start / month key
    const buckets = {}
    for (const e of expenses) {
      const date = parseISO(e.date)
      let key
      if (grouping === "day") {
        key = e.date
      } else if (grouping === "week") {
        key = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd")
      } else {
        key = e.date.slice(0, 7) // "yyyy-MM"
      }
      buckets[key] = (buckets[key] || 0) + e.amount
    }

    // Build zero-filled ordered array for the chart
    let data = []

    if (grouping === "day" && from && to) {
      const days = eachDayOfInterval({ start: parseISO(from), end: parseISO(to) })
      const dayFmt = period === "week" ? "EEE" : "MMM d"
      data = days.map((day, i) => ({
        label: format(day, dayFmt),
        total: Math.round((buckets[format(day, "yyyy-MM-dd")] || 0) * 100) / 100,
        fill:  BAR_COLORS[i % BAR_COLORS.length],
      }))

    } else if (grouping === "week" && from && to) {
      const weeks = eachWeekOfInterval(
        { start: parseISO(from), end: parseISO(to) },
        { weekStartsOn: 1 },
      )
      data = weeks.map((weekStart, i) => ({
        label: format(weekStart, "MMM d"),
        total: Math.round((buckets[format(weekStart, "yyyy-MM-dd")] || 0) * 100) / 100,
        fill:  BAR_COLORS[i % BAR_COLORS.length],
      }))

    } else if (grouping === "month" && from && to) {
      const months = eachMonthOfInterval({ start: parseISO(from), end: parseISO(to) })
      const years = new Set(months.map((m) => m.getFullYear()))
      const multiYear = years.size > 1
      data = months.map((monthStart, i) => ({
        label: format(monthStart, multiYear ? "MMM ''yy" : "MMM"),
        total: Math.round((buckets[format(monthStart, "yyyy-MM")] || 0) * 100) / 100,
        fill:  BAR_COLORS[i % BAR_COLORS.length],
      }))

    } else {
      data = Object.entries(buckets)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, total], i) => ({
          label: format(parseISO(key + "-01"), "MMM ''yy"),
          total: Math.round(total * 100) / 100,
          fill:  BAR_COLORS[i % BAR_COLORS.length],
        }))
    }

    const average = data.length > 0
      ? Math.round(data.reduce((s, d) => s + d.total, 0) / data.length * 100) / 100
      : 0

    let trend = "neutral"
    if (data.length >= 6) {
      const half      = Math.floor(data.length / 2)
      const firstAvg  = data.slice(0, half).reduce((s, d) => s + d.total, 0) / half
      const secondAvg = data.slice(half).reduce((s, d) => s + d.total, 0) / (data.length - half)
      const diff = secondAvg - firstAvg
      trend = diff > 0 ? "up" : diff < 0 ? "down" : "neutral"
    } else if (data.length >= 2) {
      const diff = data.at(-1).total - data.at(-2).total
      trend = diff > 0 ? "up" : diff < 0 ? "down" : "neutral"
    }

    const unitLabel = grouping === "day" ? "day" : grouping === "week" ? "week" : "month"

    return { chartData: data, average, trend, grouping, unitLabel }
  }, [expenses, from, to, period])
}
