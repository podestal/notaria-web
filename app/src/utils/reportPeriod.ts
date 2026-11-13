/** Period helpers for índices cronológicos / alfabéticos. */

export const MONTH_LABELS_ES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Setiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
] as const

export type MonthIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11

/** "all" = full calendar year. */
export type MonthSelection = MonthIndex | "all"

/**
 * Per-notaría floor for the year dropdown.
 * Set `VITE_REPORT_YEAR_START` in each deployment:
 * - new notaría → 2026
 * - older archive → 2015 / 2020
 * Empty years are avoided by not listing years before the notaría started.
 */
export const getReportYearStart = (): number => {
    const raw = Number(import.meta.env.VITE_REPORT_YEAR_START)
    const fallback = 2015
    if (!Number.isFinite(raw)) return fallback
    return Math.min(Math.max(Math.trunc(raw), 1950), new Date().getFullYear() + 1)
}

/** Descending years: current → yearStart (inclusive). Always includes the current year. */
export const getReportYears = (now = new Date()): number[] => {
    const current = now.getFullYear()
    const start = Math.min(getReportYearStart(), current)
    const years: number[] = []
    for (let year = current; year >= start; year -= 1) years.push(year)
    return years
}

export const rangeForPeriod = (
    year: number,
    month: MonthSelection,
): { from: Date; to: Date } => {
    if (month === "all") {
        return {
            from: new Date(year, 0, 1),
            to: new Date(year, 11, 31),
        }
    }
    return {
        from: new Date(year, month, 1),
        to: new Date(year, month + 1, 0),
    }
}

export const inferPeriodFromDates = (
    dateFrom?: Date,
    dateTo?: Date,
): { year: number; month: MonthSelection } | null => {
    if (!dateFrom || !dateTo) return null
    const y = dateFrom.getFullYear()
    if (dateTo.getFullYear() !== y) return null

    const fromMonth = dateFrom.getMonth()
    const toMonth = dateTo.getMonth()

    if (
        fromMonth === 0 &&
        dateFrom.getDate() === 1 &&
        toMonth === 11 &&
        dateTo.getDate() === 31
    ) {
        return { year: y, month: "all" }
    }

    if (fromMonth !== toMonth) return null
    if (dateFrom.getDate() !== 1) return null
    if (dateTo.getDate() !== new Date(y, fromMonth + 1, 0).getDate()) return null

    return { year: y, month: fromMonth as MonthIndex }
}
