// filter bar for period presets, custom date range, and category multi-select
"use client"

import { useState } from "react"
import {
  startOfWeek, endOfWeek,
  startOfMonth, endOfMonth,
  startOfQuarter, endOfQuarter,
  subMonths,
  format, parseISO,
} from "date-fns"
import { CalendarIcon, ChevronDown, X } from "lucide-react"
import { EXPENSE_CATEGORIES } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command, CommandEmpty, CommandGroup,
  CommandInput, CommandItem, CommandList,
} from "@/components/ui/command"

const FMT = "yyyy-MM-dd"
const fmt  = (d) => format(d, FMT)

const PERIODS = [
  { key: "week",    label: "Week"    },
  { key: "month",   label: "Month"   },
  { key: "quarter", label: "Quarter" },
  { key: "year",    label: "Year"    },
]

export function getPeriodDates(key) {
  const now = new Date()
  switch (key) {
    case "week":    return { from: fmt(startOfWeek(now, { weekStartsOn: 1 })), to: fmt(endOfWeek(now, { weekStartsOn: 1 })) }
    case "month":   return { from: fmt(startOfMonth(now)),   to: fmt(endOfMonth(now))   }
    case "quarter": return { from: fmt(startOfQuarter(now)), to: fmt(endOfQuarter(now)) }
    case "year":    return { from: fmt(startOfMonth(subMonths(now, 11))), to: fmt(endOfMonth(now)) }
    default:        return { from: "", to: "" }
  }
}

export function ExpenseFilters({ period, from, to, categories, onChange }) {
  // calendar range isn't committed until user clicks Apply
  const [calOpen, setCalOpen] = useState(false)
  const [localRange, setLocalRange] = useState(null)

  const [catOpen, setCatOpen] = useState(false)

  const hasFilter = period || from || to || categories.length > 0

  function handlePeriod(key) {
    if (period === key) {
      onChange({ period: null, from: "", to: "", categories })
    } else {
      const dates = getPeriodDates(key)
      onChange({ period: key, ...dates, categories })
    }
  }

  function handleCalOpen(open) {
    setCalOpen(open)
    // reset local selection each time so the picker starts fresh
    if (open) setLocalRange(null)
  }

  function handleRangeSelect(range) {
    setLocalRange(range ?? null)
    // don't commit yet — wait for Apply button
  }

  function applyRange() {
    if (!localRange?.from || !localRange?.to) return
    onChange({ period: null, from: fmt(localRange.from), to: fmt(localRange.to), categories })
    setCalOpen(false)
    setLocalRange(null)
  }

  // show local selection while picking, otherwise show the committed range
  const calendarSelected = localRange ?? {
    from: from ? parseISO(from) : undefined,
    to:   to   ? parseISO(to)   : undefined,
  }

  const dateLabel = from && to
    ? `${format(parseISO(from), "MMM d")} – ${format(parseISO(to), "MMM d, yyyy")}`
    : null

  function toggleCategory(cat) {
    const next = categories.includes(cat)
      ? categories.filter((c) => c !== cat)
      : [...categories, cat]
    onChange({ period, from, to, categories: next })
  }

  // reset everything back to current week
  function clearAll() {
    const dates = getPeriodDates("week")
    onChange({ period: "week", ...dates, categories: [] })
    setLocalRange(null)
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* period presets */}
        {PERIODS.map(({ key, label }) => (
          <Button
            key={key}
            variant={period === key ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => handlePeriod(key)}
          >
            {label}
          </Button>
        ))}

        <div className="h-5 w-px bg-border mx-0.5" />

        {/* custom date range picker */}
        <Popover open={calOpen} onOpenChange={handleCalOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={!period && dateLabel ? "secondary" : "outline"}
              size="sm"
              className="h-7 gap-1.5 text-xs font-normal"
            >
              <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
              <span className={!period && dateLabel ? "" : "text-muted-foreground"}>
                {!period && dateLabel ? dateLabel : "Custom range…"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={calendarSelected}
              onSelect={handleRangeSelect}
              disabled={{ after: new Date() }}
              numberOfMonths={2}
            />
            <div className="flex items-center justify-between border-t px-3 py-2 gap-2">
              <p className="text-xs text-muted-foreground">
                {!localRange?.from
                  ? "Pick a start date."
                  : !localRange?.to
                  ? "Now pick an end date."
                  : `${format(localRange.from, "MMM d")} – ${format(localRange.to, "MMM d, yyyy")}`}
              </p>
              <Button
                size="sm"
                className="h-7 text-xs"
                disabled={!localRange?.from || !localRange?.to}
                onClick={applyRange}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className="h-5 w-px bg-border mx-0.5" />

        {/* category multi-select */}
        <Popover open={catOpen} onOpenChange={setCatOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs font-normal">
              {categories.length === 0
                ? <span className="text-muted-foreground">All categories</span>
                : <span>{categories.length} selected</span>
              }
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search categories…" />
              <CommandList>
                <CommandEmpty>No categories found.</CommandEmpty>
                <CommandGroup>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <CommandItem
                      key={cat}
                      value={cat}
                      data-checked={categories.includes(cat) ? "true" : undefined}
                      onSelect={() => toggleCategory(cat)}
                    >
                      {cat}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {hasFilter && (
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={clearAll}>
            <X className="size-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* category chips shown below when any are selected */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1 pl-0.5">
          {categories.map((cat) => (
            <Badge key={cat} variant="secondary" className="gap-1 pr-1 h-6 text-xs font-normal">
              {cat}
              <button
                onClick={() => toggleCategory(cat)}
                className="rounded-sm opacity-60 hover:opacity-100 focus:outline-none"
                aria-label={`Remove ${cat}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
