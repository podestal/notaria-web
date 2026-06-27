import { useEffect, useMemo, useState } from "react"
import { RefreshCw } from "lucide-react"
import type { ComplianceKardexErrorsResponse } from "../../../../services/compliance/complianceService"

type SourceTabId = "sisgen" | "uif" | "pdt"
type SisgenTabId = "errores" | "personas" | "observaciones"

interface Props {
    data: ComplianceKardexErrorsResponse
    className?: string
    onRefresh: () => void
    isRefreshing?: boolean
}

const formatValidatedAt = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleString("es-PE", {
        dateStyle: "short",
        timeStyle: "short",
    })
}

const ComplianceKardexErrorsPanel = ({
    data,
    className = "",
    onRefresh,
    isRefreshing = false,
}: Props) => {
    const sourceTabs = useMemo(
        () => [
            {
                id: "sisgen" as const,
                label: "SISGEN",
                count: data.counts.sisgen,
            },
            {
                id: "uif" as const,
                label: "UIF",
                count: data.counts.uif,
            },
            {
                id: "pdt" as const,
                label: "PDT",
                count: data.counts.pdt,
            },
        ],
        [data.counts],
    )

    const firstSource =
        sourceTabs.find((tab) => tab.count > 0)?.id ??
        (data.errors.pdt.note || data.errors.pdt.status !== "ok" ? "pdt" : "sisgen")

    const [activeSource, setActiveSource] = useState<SourceTabId>(firstSource)

    const sisgenTabs = useMemo(
        () => [
            {
                id: "errores" as const,
                label: "Errores",
                items: data.errors.sisgen.errores ?? [],
                itemClassName: "bg-red-50 border-red-200 text-red-800",
            },
            {
                id: "personas" as const,
                label: "Personas",
                items: data.errors.sisgen.personas ?? [],
                itemClassName: "bg-slate-50 border-slate-200 text-slate-800",
            },
            {
                id: "observaciones" as const,
                label: "Observaciones",
                items: data.errors.sisgen.observaciones ?? [],
                itemClassName: "bg-amber-50 border-amber-200 text-amber-900",
            },
        ],
        [data.errors.sisgen],
    )

    const firstSisgenTab =
        sisgenTabs.find((tab) => tab.items.length > 0)?.id ?? "errores"
    const [activeSisgenTab, setActiveSisgenTab] = useState<SisgenTabId>(firstSisgenTab)
    const activeSisgen = sisgenTabs.find((tab) => tab.id === activeSisgenTab) ?? sisgenTabs[0]

    useEffect(() => {
        const nextSource = sourceTabs.find((tab) => tab.count > 0)?.id
        if (nextSource) setActiveSource(nextSource)
    }, [sourceTabs])

    useEffect(() => {
        const nextSisgen = sisgenTabs.find((tab) => tab.items.length > 0)?.id
        if (nextSisgen) setActiveSisgenTab(nextSisgen)
    }, [sisgenTabs])

    const uifErrors = data.errors.uif.errors ?? []
    const uifObservations = data.errors.uif.observations ?? []
    const pdtErrors = data.errors.pdt.errors ?? []

    return (
        <aside
            className={`flex h-full min-h-0 w-full shrink-0 flex-col overflow-hidden border-slate-200 bg-slate-50 lg:border-r ${className}`}
        >
            <div className="border-b border-slate-200 px-4 py-3">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            Errores de cumplimiento
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                            {data.kardex}
                        </p>
                        <p
                            className={`mt-1 text-xs font-semibold ${
                                data.has_errors ? "text-red-600" : "text-green-600"
                            }`}
                        >
                            {data.has_errors
                                ? `${data.counts.total} incidencia${data.counts.total === 1 ? "" : "s"}`
                                : "Sin incidencias"}
                        </p>
                        {data.validated_at && (
                            <p className="mt-1 text-[10px] text-slate-500">
                                Validado: {formatValidatedAt(data.validated_at)}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        title="Actualizar errores"
                        className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                            aria-hidden
                        />
                        Actualizar
                    </button>
                </div>
            </div>

            <nav
                className="grid grid-cols-3 gap-1 border-b border-slate-200 p-2"
                aria-label="Fuentes de error"
            >
                {sourceTabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveSource(tab.id)}
                        className={`rounded-lg px-2 py-1.5 text-center text-[10px] font-semibold uppercase transition-colors ${
                            activeSource === tab.id
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-white text-slate-700 hover:bg-slate-100"
                        }`}
                    >
                        <span className="block">{tab.label}</span>
                        <span
                            className={`mt-0.5 inline-block rounded-full px-1.5 text-[9px] ${
                                activeSource === tab.id
                                    ? "bg-blue-500 text-white"
                                    : "bg-slate-200 text-slate-700"
                            }`}
                        >
                            {tab.count}
                        </span>
                    </button>
                ))}
            </nav>

            <div className="min-h-0 flex-1 overflow-y-auto p-3">
                {activeSource === "sisgen" && (
                    <>
                        <nav className="mb-2 flex flex-col gap-1" aria-label="Errores SISGEN">
                            {sisgenTabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveSisgenTab(tab.id)}
                                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                                        activeSisgenTab === tab.id
                                            ? "bg-sky-600 text-white"
                                            : "bg-white text-slate-700 hover:bg-slate-100"
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span
                                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                                            activeSisgenTab === tab.id
                                                ? "bg-sky-500 text-white"
                                                : "bg-slate-200 text-slate-700"
                                        }`}
                                    >
                                        {tab.items.length}
                                    </span>
                                </button>
                            ))}
                        </nav>
                        {activeSisgen.items.length > 0 ? (
                            <ul className="space-y-2">
                                {activeSisgen.items.map((item, idx) => (
                                    <li
                                        key={`${activeSisgen.id}-${idx}`}
                                        className={`rounded-md border px-2.5 py-2 text-xs leading-snug ${activeSisgen.itemClassName}`}
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-xs text-slate-500">Sin {activeSisgen.label.toLowerCase()}.</p>
                        )}
                    </>
                )}

                {activeSource === "uif" && (
                    <div className="space-y-3">
                        {uifErrors.length > 0 && (
                            <div>
                                <p className="mb-2 text-[10px] font-semibold uppercase text-slate-500">
                                    Errores
                                </p>
                                <ul className="space-y-2">
                                    {uifErrors.map((item, idx) => (
                                        <li
                                            key={`uif-error-${idx}`}
                                            className="rounded-md border border-indigo-200 bg-indigo-50 px-2.5 py-2 text-xs leading-snug text-indigo-900"
                                        >
                                            <p className="font-semibold">{item.error_type}</p>
                                            <p className="mt-1">{item.error_description}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {uifObservations.length > 0 && (
                            <div>
                                <p className="mb-2 text-[10px] font-semibold uppercase text-slate-500">
                                    Observaciones
                                </p>
                                <ul className="space-y-2">
                                    {uifObservations.map((item, idx) => (
                                        <li
                                            key={`uif-obs-${idx}`}
                                            className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs leading-snug text-amber-900"
                                        >
                                            {item.error_description ? (
                                                <>
                                                    <p className="font-semibold">{item.error_type}</p>
                                                    <p className="mt-1">{item.error_description}</p>
                                                </>
                                            ) : (
                                                String(item)
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {uifErrors.length === 0 && uifObservations.length === 0 && (
                            <p className="text-xs text-slate-500">Sin errores UIF.</p>
                        )}
                    </div>
                )}

                {activeSource === "pdt" && (
                    <div className="space-y-3">
                        <div className="rounded-md border border-slate-200 bg-white px-2.5 py-2 text-xs text-slate-700">
                            <p className="font-semibold uppercase text-[10px] text-slate-500">
                                Estado
                            </p>
                            <p className="mt-1 capitalize">{data.errors.pdt.status || "—"}</p>
                        </div>
                        {data.errors.pdt.note && (
                            <p className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-900">
                                {data.errors.pdt.note}
                            </p>
                        )}
                        {pdtErrors.length > 0 ? (
                            <ul className="space-y-2">
                                {pdtErrors.map((item, idx) => (
                                    <li
                                        key={`pdt-${idx}`}
                                        className="rounded-md border border-orange-200 bg-orange-50 px-2.5 py-2 text-xs leading-snug text-orange-900"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            !data.errors.pdt.note && (
                                <p className="text-xs text-slate-500">Sin errores PDT.</p>
                            )
                        )}
                    </div>
                )}
            </div>
        </aside>
    )
}

export default ComplianceKardexErrorsPanel
