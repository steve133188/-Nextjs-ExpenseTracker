"use client"

import { useTheme } from "next-themes"
import { Wallet, Plus, RefreshCw, Sun, Moon } from "lucide-react"
import { useExpenses } from "@/hooks/use-expenses"
import { useExpenseFilter } from "@/hooks/use-expense-filter"
import { ExpenseFilters } from "@/components/expenses/filters/expense-filters"
import { SummaryCard } from "@/components/expenses/summary-card"
import { ExpenseChart } from "@/components/expenses/charts/expense-chart"
import { MonthlyTrendsChart } from "@/components/expenses/charts/monthly-trends-chart"
import { ExpenseTable } from "@/components/expenses/table/expense-table"
import { ExpenseDialog } from "@/components/expenses/expense-dialog"
import { ExpenseListSkeleton } from "@/components/expenses/table/expense-list-skeleton"
import { DonutChartSkeleton, BarChartSkeleton } from "@/components/expenses/charts/chart-skeleton"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

function ChartCard({ title, skeleton, isLoading, isRefetching, children }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {isLoading ? <Skeleton className="h-4 w-32" /> : (
            <>
              {title}
              {isRefetching && <Spinner className="size-3 text-muted-foreground" />}
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? skeleton : (
          <div className={cn("transition-opacity duration-200", isRefetching && "opacity-50")}>
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const { theme, setTheme } = useTheme()
  const expenseFilter = useExpenseFilter()
  const { filter } = expenseFilter

  const query = useExpenses({ categories: filter.categories, from: filter.from, to: filter.to })
  const expenses     = query.data ?? []
  const isLoading    = query.isLoading
  const isRefetching = query.isFetching && !query.isLoading

  // SPA: everything renders here — no page navigation, React state drives all updates
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-2 max-w-5xl">
          <Wallet className="size-5" />
          <h1 className="text-lg font-semibold">Expense Tracker</h1>
          <div className="ml-auto flex items-center gap-2">
            <ExpenseDialog
              mode="add"
              trigger={
                <Button size="sm">
                  <Plus className="size-4" />
                  Add Expense
                </Button>
              }
            />
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle dark mode"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="size-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-5xl space-y-4">
        <div className="rounded-lg border bg-card px-4 py-2.5">
          <ExpenseFilters {...expenseFilter} />
        </div>

        <SummaryCard
          expenses={expenses}
          from={filter.from}
          to={filter.to}
          isLoading={isLoading}
          isFetching={query.isFetching}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard
            title="Spending by Category"
            skeleton={<DonutChartSkeleton />}
            isLoading={isLoading}
            isRefetching={isRefetching}
          >
            <ExpenseChart expenses={expenses} />
          </ChartCard>

          <ChartCard
            title="Expenses Trend"
            skeleton={<BarChartSkeleton />}
            isLoading={isLoading}
            isRefetching={isRefetching}
          >
            <MonthlyTrendsChart
              expenses={expenses}
              from={filter.from}
              to={filter.to}
              period={filter.period}
            />
          </ChartCard>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
            <CardTitle className="text-base flex items-center gap-2">
              {isLoading ? <Skeleton className="h-5 w-24" /> : (
                <>
                  Expenses
                  {isRefetching && <Spinner className="size-3.5 text-muted-foreground" />}
                </>
              )}
            </CardTitle>
          </CardHeader>

          {isLoading ? (
            <CardContent className="pt-0">
              <ExpenseListSkeleton />
            </CardContent>
          ) : query.isError ? (
            <CardContent className="pt-0">
              <div className="flex flex-col items-center gap-3 py-10 text-muted-foreground">
                <p className="text-sm">Failed to load expenses.</p>
                <Button variant="outline" size="sm" onClick={() => query.refetch()}>
                  <RefreshCw className="size-4" />
                  Retry
                </Button>
              </div>
            </CardContent>
          ) : (
            <div className={cn("transition-opacity duration-200", isRefetching && "opacity-50")}>
              <ExpenseTable expenses={expenses} />
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
