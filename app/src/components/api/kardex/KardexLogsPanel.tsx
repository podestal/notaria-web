import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, History, Loader2, RefreshCw, User } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import useAuthStore from "../../../store/useAuthStore"
import useGetKardexLogs from "../../../hooks/api/kardex/useGetKardexLogs"
import {
    KARDEX_LOGS_QUERY_KEY,
    type KardexLogAction,
    type KardexLogChangeValue,
} from "../../../services/api/kardexLogsService"

interface Props {
    idkardex: number
    enabled: boolean
    className?: string
}

const FIELD_LABELS: Record<string, string> = {
    idabogado: "Abogado",
    idusuario: "Usuario",
    responsable: "Responsable",
    recepcion: "Recepción",
    fktemplate: "Plantilla",
    referencia: "Referencia",
    contrato: "Contrato",
    codactos: "Actos",
    fechaingreso: "Fecha de ingreso",
    monto: "Monto",
    porcentaje: "Porcentaje",
    ofondo: "Origen de fondos",
    idmon: "Moneda",
    fpago: "Forma de pago",
    idoppago: "Oportunidad de pago",
    codmepag: "Medio de pago",
    idbancos: "Banco",
}

const TABLE_LABELS: Record<string, string> = {
    cliente: "Cliente",
    cliente1: "Cliente",
    cliente2: "Cliente",
    contratantesxacto: "Participa",
    detallebienes: "Detalle de bienes",
    detalle_bienes: "Detalle de bienes",
    documento: "Documento",
    documentos: "Documento",
    detallemediopago: "Medio de pago",
    detallemediodepago: "Medio de pago",
    detalleactoskardex: "Actos del kardex",
    kardex: "Kardex",
    renta: "Renta",
    patrimonial: "Patrimonial",
    participa: "Participa",
    predios: "Predios",
    representantes: "Representantes",
    vehicle: "Vehículo",
    vehiculo: "Vehículo",
}

const ACTION_META: Record<string, { label: string; className: string }> = {
    create: {
        label: "Creó",
        className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    },
    update: {
        label: "Actualizó",
        className: "bg-amber-50 text-amber-800 ring-amber-200",
    },
    delete: {
        label: "Eliminó",
        className: "bg-rose-50 text-rose-700 ring-rose-200",
    },
}

const tableLabel = (tableName: string) =>
    TABLE_LABELS[tableName] ??
    tableName.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

const fieldLabel = (field: string) => FIELD_LABELS[field] ?? field

const actionMeta = (action: KardexLogAction) =>
    ACTION_META[action] ?? {
        label: action,
        className: "bg-slate-100 text-slate-700 ring-slate-200",
    }

const formatLogTime = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleString("es-PE", {
        dateStyle: "short",
        timeStyle: "short",
    })
}

const formatLogValue = (value: KardexLogChangeValue): string => {
    if (value == null || value === "") return "—"
    if (typeof value === "object") {
        if (Array.isArray(value)) {
            return value.length === 0 ? "—" : value.map((item) => formatLogValue(item)).join(", ")
        }
        const entries = Object.entries(value)
        if (entries.length === 0) return "—"
        return entries
            .map(([key, item]) => `${key}: ${formatLogValue(item)}`)
            .join(" · ")
    }
    return String(value)
}

const KardexLogsPanel = ({ idkardex, enabled, className = "" }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)
    const [openId, setOpenId] = useState<number | null>(null)

    useEffect(() => {
        setPage(1)
    }, [idkardex])

    const { data, isLoading, isError, error, refetch, isFetching } = useGetKardexLogs({
        access,
        idkardex,
        page,
        enabled,
    })

    const autoOpenKey = useRef("")
    useEffect(() => {
        const firstId = data?.results?.[0]?.id
        const key = `${idkardex}-${page}-${firstId ?? ""}`
        if (firstId != null && autoOpenKey.current !== key) {
            autoOpenKey.current = key
            setOpenId(firstId)
        }
    }, [data?.results, idkardex, page])

    useEffect(() => {
        if (!enabled) return

        return queryClient.getMutationCache().subscribe((event) => {
            if (
                event.type === "updated" &&
                event.action.type === "success" &&
                event.mutation.state.status === "success"
            ) {
                void queryClient.invalidateQueries({ queryKey: [KARDEX_LOGS_QUERY_KEY, idkardex] })
            }
        })
    }, [enabled, idkardex, queryClient])

    const logs = data?.results ?? []
    const count = data?.count ?? 0
    const isRefreshing = isFetching && !isLoading
    const hasPrev = Boolean(data?.previous) || page > 1
    const hasNext = Boolean(data?.next)

    return (
        <aside
            className={`flex min-h-0 w-full shrink-0 flex-col overflow-hidden rounded-lg border border-slate-200 bg-slate-50 lg:rounded-none lg:border-y-0 lg:border-l-0 lg:border-r ${className}`}
        >
            <div className="border-b border-slate-200 px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            <History className="h-3.5 w-3.5" aria-hidden />
                            Historial
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">
                            {count === 0
                                ? "Sin cambios"
                                : count === 1
                                  ? "1 cambio"
                                  : `${count} cambios`}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isRefreshing}
                        className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60"
                        aria-label="Actualizar historial"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
                {isLoading && (
                    <div className="flex h-full min-h-[8rem] items-center justify-center gap-2 text-xs text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cargando historial…
                    </div>
                )}

                {isError && !data && (
                    <div className="flex min-h-[8rem] flex-col items-center justify-center gap-2 text-center text-xs text-red-700">
                        <p>{error?.message || "No se pudo cargar el historial."}</p>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="cursor-pointer rounded-lg border border-red-300 bg-white px-2 py-1 text-[10px] font-semibold hover:bg-red-50"
                        >
                            Reintentar
                        </button>
                    </div>
                )}

                {data && logs.length === 0 && (
                    <div className="flex min-h-[8rem] flex-col items-center justify-center gap-2 px-2 text-center">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                            <History className="h-4 w-4" aria-hidden />
                        </span>
                        <p className="text-xs font-medium text-slate-600">Aún no hay cambios registrados</p>
                    </div>
                )}

                {logs.length > 0 && (
                    <ul className="space-y-2">
                        {logs.map((log) => {
                            const meta = actionMeta(log.action)
                            const isOpen = openId === log.id
                            const fields = Object.entries(log.changes ?? {})
                            return (
                                <li key={log.id}>
                                    <button
                                        type="button"
                                        onClick={() => setOpenId(isOpen ? null : log.id)}
                                        className="flex w-full cursor-pointer items-start gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-left transition hover:border-sky-200 hover:bg-sky-50/60"
                                    >
                                        <span
                                            className={`mt-0.5 inline-flex shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${meta.className}`}
                                        >
                                            {meta.label}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-xs font-semibold text-slate-800">
                                                {tableLabel(log.table_name)}
                                            </span>
                                            <span className="mt-1 flex min-w-0 items-center gap-1 text-[11px] text-slate-700">
                                                <User className="h-3 w-3 shrink-0 text-indigo-500" aria-hidden />
                                                <span className="truncate font-semibold">
                                                    {log.user_name || log.username || "—"}
                                                </span>
                                            </span>
                                            <span className="mt-0.5 block truncate text-[11px] text-slate-400">
                                                {formatLogTime(log.created_at)}
                                            </span>
                                            {(log.record_label || (log.record_pk && log.record_pk !== "*")) && (
                                                <span className="mt-0.5 block truncate text-[10px] text-slate-400">
                                                    {log.record_label && log.record_label !== log.record_pk
                                                        ? log.record_label
                                                        : `#${log.record_pk}`}
                                                </span>
                                            )}
                                        </span>
                                        <ChevronDown
                                            className={`mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400 transition ${isOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-1 space-y-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2">
                                                    {fields.length === 0 ? (
                                                        <p className="text-[11px] text-slate-500">Sin detalle de campos</p>
                                                    ) : (
                                                        fields.map(([field, change]) => (
                                                            <div key={field} className="text-[11px] leading-snug">
                                                                <p className="font-mono text-[10px] font-semibold text-slate-500">
                                                                    {fieldLabel(field)}
                                                                </p>
                                                                <p className="mt-0.5 text-slate-700">
                                                                    <span className="text-slate-400">
                                                                        {formatLogValue(change?.old)}
                                                                    </span>
                                                                    <span className="mx-1 text-slate-300">→</span>
                                                                    <span className="font-medium text-slate-800">
                                                                        {formatLogValue(change?.new)}
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        ))
                                                    )}
                                                    {log.source && (
                                                        <p className="truncate pt-1 text-[10px] text-slate-400" title={log.source}>
                                                            {log.source}
                                                        </p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>

            {count > 0 && (hasPrev || hasNext) && (
                <div className="flex items-center justify-between gap-2 border-t border-slate-200 px-3 py-2">
                    <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={!hasPrev || isFetching}
                        className="cursor-pointer rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Anterior
                    </button>
                    <p className="text-[11px] font-medium tabular-nums text-slate-500">
                        Página {page}
                    </p>
                    <button
                        type="button"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={!hasNext || isFetching}
                        className="cursor-pointer rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </aside>
    )
}

export default KardexLogsPanel
