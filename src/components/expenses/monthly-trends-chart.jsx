// bar chart showing spending trend over the selected period
"use client"

import { useMemo } from "react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, ReferenceLine, Cell,
} from "recharts"
import {
  differenceInDays,
  eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval,
  startOfWeek, format, parseISO,
} from "date-fns"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const BAR_COLORS = [
  "var(--chart-1)", "var(--chart-2)", "var(--chart-3)",
  "var(--chart-4)", "var(--chart-5)",
]

const chartConfig = { total: { label: "Spending" } }

// pick grouping based on period: week/month → daily, quarter → weekly, year → monthly
function resolveGrouping(period, from, to) {
  if (period === "week")    return "day"
  if (period === "month")   return "day"
  if (period === "quarter") return "week"
  if (period === "year")    return "month"
  // Custom range or no filter
  if (!from || !to) return "month"
  const days = differenceInDays(parseISO(to), parseISO(from)) + 1
  if (days <= 14) return "day"
  if (days <= 90) return "week"
  return "month"
}

export function MonthlyTrendsChart({ expenses, from, to, period }) {
  const { chartData, average, trend, grouping, unitLabel } = useMemo(() => {
    const grouping = resolveGrouping(period, from, to)

    // group expenses into buckets by day/week/month key
    const buckets = {}
    for (const e of expenses) {
      const date = parseISO(e.date)
      let key
      if (grouping === "day") {
        key = e.date
      } else if (grouping === "week") {
        key = format(startOfWeek(date, { weekStartsOn: 1 }), "yyyy-MM-dd")
      } else {
        key = e.date.slice(0, 7)   // "yyyy-MM"
      }
      buckets[key] = (buckets[key] || 0) + e.amount
    }

    // build zero-filled ordered array for the chart
    let data = []

    if (grouping === "day" && from && to) {
      const days = eachDayOfInterval({ start: parseISO(from), end: parseISO(to) })
      // week shows "Mon", month shows "1", custom shows "Mar 16"
      const dayFmt = period === "week" ? "EEE" : period === "month" ? "d" : "MMM d"
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
      // add year suffix if data spans multiple years, e.g. "Jan '24"
      const years = new Set(months.map((m) => m.getFullYear()))
      const multiYear = years.size > 1
      data = months.map((monthStart, i) => ({
        label: format(monthStart, multiYear ? "MMM ''yy" : "MMM"),
        total: Math.round((buckets[format(monthStart, "yyyy-MM")] || 0) * 100) / 100,
        fill:  BAR_COLORS[i % BAR_COLORS.length],
      }))

    } else {
      // no date range — just show whatever months have data
      data = Object.entries(buckets)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, total], i) => ({
          label: format(parseISO(key + "-01"), "MMM ''yy"),
          total: Math.round(total * 100) / 100,
          fill:  BAR_COLORS[i % BAR_COLORS.length],
        }))
    }

    const avg = data.length > 0
      ? Math.round(data.reduce((s, d) => s + d.total, 0) / data.length * 100) / 100
      : 0

    // for long ranges split into halves, for short ranges just compare last two buckets
    const unitLabelInner = grouping === "day" ? "day" : grouping === "week" ? "week" : "month"
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

    return { chartData: data, average: avg, trend, grouping, unitLabel: unitLabelInner }
  }, [expenses, from, to, period])

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
        No data to display yet.
      </div>
    )
  }

  // rotate labels when there are too many months, thin out ticks for long daily ranges
  const rotateLabels = grouping === "month" && chartData.length > 6
  const xInterval    =
    (grouping === "day"  && chartData.length > 14) ? Math.ceil(chartData.length / 8) - 1 :
    (grouping === "week" && chartData.length > 8)  ? Math.ceil(chartData.length / 6) - 1 :
    0
  const bottomMargin = rotateLabels ? 36 : 4

  // only show value labels on top of bars when there aren't too many
  const showLabelList = chartData.length <= 7

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  return (
    <div className="space-y-3">
      <ChartContainer
        config={chartConfig}
        className="w-full"
        style={{ height: rotateLabels ? 236 : 200 }}
      >
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 8, left: 0, bottom: bottomMargin }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />

          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            interval={xInterval}
            tick={
              rotateLabels
                ? { fontSize: 10, angle: -40, textAnchor: "end", dy: 4 }
                : { fontSize: 11 }
            }
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`}
            width={46}
          />

          <ReferenceLine
            y={average}
            stroke="var(--muted-foreground)"
            strokeDasharray="4 3"
            strokeOpacity={0.5}
          />

          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Spending"]}
              />
            }
          />

          <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
            {showLabelList && (
              <LabelList
                dataKey="total"
                position="top"
                className="fill-foreground"
                style={{ fontSize: 10 }}
                formatter={(v) =>
                  v > 0 ? `$${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}` : ""
                }
              />
            )}
          </Bar>
        </BarChart>
      </ChartContainer>

      <div className="flex items-center justify-between border-t pt-2">
        <span className="text-xs text-muted-foreground">
          Avg / {unitLabel}:{" "}
          <span className="font-semibold text-foreground">${average.toFixed(0)}</span>
        </span>
        {chartData.length >= 2 && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold
            ${trend === "up"
              ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
              : trend === "down"
              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
              : "bg-muted text-muted-foreground"
            }`}
          >
            <TrendIcon className="size-3" />
          </span>
        )}
      </div>
    </div>
  )
}
