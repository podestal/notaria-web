import { useMemo, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import TopModal from "../../../ui/TopModal"
import useGetComplianceMeKardex from "../../../../hooks/compliance/useGetComplianceMeKardex"
import useGetComplianceMeKardexMonth from "../../../../hooks/compliance/useGetComplianceMeKardexMonth"
import useAuthStore from "../../../../store/useAuthStore"
import getTitleCase from "../../../../utils/getTitleCase"
import type {
    ComplianceErrorCounts,
    ComplianceMeMonthBucket,
} from "../../../../services/compliance/complianceService"
import ComplianceKardexModal from "./ComplianceKardexModal"
import { invalidateComplianceQueries } from "../../../../hooks/compliance/invalidateComplianceQueries"

const MONTH_LABELS = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
]

const SHORT_MONTHS = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
]

const ErrorCountsHeader = () => (
    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-600">
        <span>SISGEN</span>
        <span>UIF</span>
        <span>PDT</span>
    </div>
)

const ErrorCountsRow = ({ counts }: { counts: ComplianceErrorCounts }) => (
    <div className="grid grid-cols-3 gap-2 text-center text-sm text-slate-700">
        <span>{counts.sisgen}</span>
        <span>{counts.uif}</span>
        <span>{counts.pdt}</span>
    </div>
)

const monthKey = (m: Pick<ComplianceMeMonthBucket, "year" | "month">) =>
    `${m.year}-${m.month}`

interface Props {
    isOpen: boolean
    onClose: () => void
}

const ComplianceMeKardexModal = ({ isOpen, onClose }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const queryClient = useQueryClient()
    const [kardexId, setKardexId] = useState(0)
    const [kardexCode, setKardexCode] = useState("")
    const [isKardexOpen, setIsKardexOpen] = useState(false)
    const [selectedMonthKey, setSelectedMonthKey] = useState<string | null>(null)

    const { data, isLoading, isError, error } = useGetComplianceMeKardex({
        access,
        enabled: isOpen,
    })

    const months = useMemo((): ComplianceMeMonthBucket[] => data?.months ?? [], [data])

    const focusKey = data ? monthKey(data) : null
    const activeKey =
        selectedMonthKey && months.some((m) => monthKey(m) === selectedMonthKey)
            ? selectedMonthKey
            : focusKey ?? (months[0] ? monthKey(months[0]) : null)

    const activeMonth =
        months.find((m) => monthKey(m) === activeKey) ?? months[0] ?? null

    const {
        data: monthDetail,
        isLoading: isMonthLoading,
        isError: isMonthError,
        error: monthError,
        isFetching: isMonthFetching,
    } = useGetComplianceMeKardexMonth({
        access,
        year: activeMonth?.year ?? null,
        month: activeMonth?.month ?? null,
        enabled: isOpen && activeMonth != null,
    })

    const handleClose = () => {
        setIsKardexOpen(false)
        setKardexId(0)
        setKardexCode("")
        setSelectedMonthKey(null)
        onClose()
    }

    const handleKardexClose = () => {
        setIsKardexOpen(false)
        setKardexId(0)
        setKardexCode("")
        void invalidateComplianceQueries(queryClient)
    }

    const displayCounts = monthDetail?.counts ?? activeMonth?.counts
    const displayKardexWithErrors =
        monthDetail?.kardex_with_errors ?? activeMonth?.kardex_with_errors ?? 0
    const kardexList = monthDetail?.kardex ?? []
    const userName =
        monthDetail?.user?.name ||
        monthDetail?.user?.username ||
        data?.user?.name ||
        data?.user?.username ||
        ""

    const rollingTotal = months.reduce((sum, m) => sum + (m.counts?.total ?? 0), 0)

    return (
        <>
            <TopModal isOpen={isOpen} onClose={handleClose} wide>
                <div className="flex min-h-0 flex-1 flex-col gap-4">
                    <header className="border-b border-slate-200 pb-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                            Mis kardex con errores
                        </p>
                        <h3 className="text-lg font-semibold text-slate-800">
                            {getTitleCase(userName)}
                        </h3>
                        {months.length > 0 && (
                            <p className="text-xs text-slate-500">
                                Últimos {months.length} meses · {rollingTotal} error
                                {rollingTotal === 1 ? "" : "es"} en total
                            </p>
                        )}
                    </header>

                    {isLoading && (
                        <p className="py-8 text-center text-sm text-slate-500 animate-pulse">
                            Cargando tus pendientes...
                        </p>
                    )}

                    {isError && (
                        <p className="py-8 text-center text-sm text-red-600">
                            Error al cargar: {error.message}
                        </p>
                    )}

                    {data && activeMonth && displayCounts && (
                        <>
                            {months.length > 1 && (
                                <nav className="flex flex-wrap gap-2" aria-label="Meses">
                                    {months.map((m) => {
                                        const key = monthKey(m)
                                        const isActive = key === activeKey
                                        const isFocus = key === focusKey
                                        const hasErrors =
                                            (m.counts?.total ?? 0) > 0 ||
                                            (m.kardex_with_errors ?? 0) > 0
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setSelectedMonthKey(key)}
                                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                                    isActive
                                                        ? isFocus
                                                            ? "bg-amber-500 text-white"
                                                            : "bg-rose-600 text-white"
                                                        : hasErrors
                                                          ? "bg-slate-100 text-slate-800 ring-1 ring-slate-200 hover:bg-slate-200"
                                                          : "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100 hover:bg-emerald-100"
                                                }`}
                                            >
                                                {SHORT_MONTHS[m.month - 1] ?? m.month} {m.year}
                                                <span className="ml-1.5 opacity-80">
                                                    ({m.counts.total})
                                                </span>
                                            </button>
                                        )
                                    })}
                                </nav>
                            )}

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                    <p className="text-[10px] font-semibold uppercase text-slate-500">
                                        Con errores
                                    </p>
                                    <p className="text-xl font-bold text-rose-700">
                                        {displayKardexWithErrors}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                    <p className="text-[10px] font-semibold uppercase text-slate-500">
                                        SISGEN
                                    </p>
                                    <p className="text-xl font-bold text-sky-700">
                                        {displayCounts.sisgen}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                    <p className="text-[10px] font-semibold uppercase text-slate-500">
                                        UIF
                                    </p>
                                    <p className="text-xl font-bold text-indigo-700">
                                        {displayCounts.uif}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                    <p className="text-[10px] font-semibold uppercase text-slate-500">
                                        PDT
                                    </p>
                                    <p className="text-xl font-bold text-violet-700">
                                        {displayCounts.pdt}
                                    </p>
                                </div>
                                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                                    <p className="text-[10px] font-semibold uppercase text-slate-500">
                                        Total
                                    </p>
                                    <p className="text-xl font-bold text-rose-700">
                                        {displayCounts.total}
                                    </p>
                                </div>
                            </div>

                            <p className="text-xs text-slate-500">
                                Periodo:{" "}
                                {MONTH_LABELS[activeMonth.month - 1] ?? activeMonth.month}{" "}
                                {activeMonth.year}
                                {monthKey(activeMonth) === focusKey
                                    ? " (mes actual)"
                                    : " (mes anterior)"}
                                {isMonthFetching && !isMonthLoading ? " · actualizando…" : ""}
                            </p>

                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <div className="grid min-w-[720px] grid-cols-6 gap-2 bg-slate-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                                    <p>Kardex</p>
                                    <p>Nº escritura</p>
                                    <p className="col-span-2">Fecha escritura</p>
                                    <ErrorCountsHeader />
                                    <p className="text-center">Total</p>
                                </div>
                                {isMonthLoading && (
                                    <p className="px-3 py-6 text-center text-sm text-slate-500 animate-pulse">
                                        Cargando kardex del mes...
                                    </p>
                                )}
                                {isMonthError && !monthDetail && (
                                    <p className="px-3 py-6 text-center text-sm text-red-600">
                                        Error al cargar kardex: {monthError.message}
                                    </p>
                                )}
                                {!isMonthLoading && !isMonthError && kardexList.length === 0 && (
                                    <p className="px-3 py-6 text-center text-sm text-slate-500">
                                        No hay kardex con errores en este periodo.
                                    </p>
                                )}
                                {!isMonthLoading &&
                                    kardexList.map((item, index) => (
                                        <div
                                            key={item.idkardex}
                                            className={`grid min-w-[720px] grid-cols-6 gap-2 px-3 py-2 text-sm text-slate-700 ${
                                                index % 2 === 0 ? "bg-white" : "bg-slate-50"
                                            }`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setKardexId(item.idkardex)
                                                    setKardexCode(item.kardex)
                                                    setIsKardexOpen(true)
                                                }}
                                                className="text-left font-medium text-sky-700 hover:text-sky-900 hover:underline"
                                            >
                                                {item.kardex}
                                            </button>
                                            <p>{item.numescritura ?? "—"}</p>
                                            <p className="col-span-2">
                                                {item.fechaescritura ||
                                                    item.fechaingreso ||
                                                    "—"}
                                            </p>
                                            <ErrorCountsRow counts={item.counts} />
                                            <p className="text-center font-medium">
                                                {item.counts.total}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                        </>
                    )}
                </div>
            </TopModal>

            <ComplianceKardexModal
                isOpen={isKardexOpen}
                onClose={handleKardexClose}
                idkardex={kardexId}
                kardex={kardexCode}
            />
        </>
    )
}

export default ComplianceMeKardexModal
