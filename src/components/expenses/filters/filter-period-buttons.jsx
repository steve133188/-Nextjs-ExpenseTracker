"use client"

import { Button } from "@/components/ui/button"

const PERIODS = [
  { key: "month", label: "Month" },
  { key: "year",  label: "Year"  },
]

export function FilterPeriodButtons({ period, handlePeriod }) {
  return (
    <>
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
    </>
  )
}
