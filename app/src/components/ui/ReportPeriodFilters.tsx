import { useMemo } from "react"
import { CalendarRange } from "lucide-react"
import {
    MONTH_LABELS_ES,
    getReportYears,
    rangeForPeriod,
    type MonthSelection,
} from "../../utils/reportPeriod"

interface Props {
    year: number
    month: MonthSelection
    onChange: (next: { year: number; month: MonthSelection; from: Date; to: Date }) => void
}

const ReportPeriodFilters = ({ year, month, onChange }: Props) => {
    const years = useMemo(() => getReportYears(), [])

    const apply = (nextYear: number, nextMonth: MonthSelection) => {
        const { from, to } = rangeForPeriod(nextYear, nextMonth)
        onChange({ year: nextYear, month: nextMonth, from, to })
    }

    return (
        <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    <CalendarRange className="h-3.5 w-3.5" aria-hidden />
                    Periodo
                </p>
                <label className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="font-semibold text-slate-500">Año</span>
                    <select
                        value={year}
                        onChange={(e) => apply(Number(e.target.value), month)}
                        className="cursor-pointer rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-800 outline-none transition hover:border-slate-300 focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
                    >
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div
                role="radiogroup"
                aria-label="Mes del índice"
                className="flex flex-wrap gap-1.5"
            >
                <button
                    type="button"
                    role="radio"
                    aria-checked={month === "all"}
                    onClick={() => apply(year, "all")}
                    className={`cursor-pointer rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                        month === "all"
                            ? "border-slate-800 bg-slate-800 text-white shadow-sm"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                    }`}
                >
                    Año completo
                </button>
                {MONTH_LABELS_ES.map((label, index) => {
                    const value = index as MonthSelection
                    const isActive = month === value
                    return (
                        <button
                            key={label}
                            type="button"
                            role="radio"
                            aria-checked={isActive}
                            onClick={() => apply(year, value)}
                            className={`cursor-pointer rounded-full border px-3 py-1.5 text-[11px] font-semibold transition ${
                                isActive
                                    ? "border-sky-600 bg-sky-600 text-white shadow-sm shadow-sky-200"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800"
                            }`}
                        >
                            {label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default ReportPeriodFilters
