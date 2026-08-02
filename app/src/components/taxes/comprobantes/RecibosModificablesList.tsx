import { useEffect, useMemo, useState } from "react"
import { Loader2, RefreshCw, Search, X } from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import useGetRecibosModificables from "../../../hooks/taxes/recibos/useGetRecibosModificables"
import {
    RECIBO_COMPROBANTE_BOLETA,
    RECIBO_COMPROBANTE_FACTURA,
} from "../../../services/taxes/recibosService"
import Paginator from "../../ui/Paginator"
import ReciboModificableCard from "./ReciboModificableCard"
import type { EmisionFormVariant } from "./comprobanteFormConfig"

const PAGE_SIZE = 10

type TriState = "" | "true" | "false"
type NotaVariant = Extract<EmisionFormVariant, "nota_credito" | "nota_debito">

type DraftFilters = {
    comprobante_id: string
    serie: string
    numero: string
    aceptada_sunat: TriState
    fecha_emision_desde: string
    fecha_emision_hasta: string
    kardex: string
    has_kardex: TriState
    persona_documento: string
    persona_nombres: string
    usuario: string
}

const emptyDraft = (): DraftFilters => ({
    comprobante_id: "",
    serie: "",
    numero: "",
    aceptada_sunat: "",
    fecha_emision_desde: "",
    fecha_emision_hasta: "",
    kardex: "",
    has_kardex: "",
    persona_documento: "",
    persona_nombres: "",
    usuario: "",
})

const inputClassName =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-800 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"

interface Props {
    title?: string
    description?: string
    /** When set, cards only offer this note type (matches page tab). */
    preferredVariant?: NotaVariant
}

const RecibosModificablesList = ({
    title = "Comprobantes modificables",
    description = "Facturas y boletas disponibles para emitir una nota de crédito o débito.",
    preferredVariant,
}: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const [page, setPage] = useState(1)
    const [draft, setDraft] = useState<DraftFilters>(emptyDraft)
    const [applied, setApplied] = useState<DraftFilters>(emptyDraft)
    const [openForm, setOpenForm] = useState<{
        id_recibo: number
        variant: NotaVariant
    } | null>(null)

    useEffect(() => {
        if (!preferredVariant) return
        setOpenForm((prev) =>
            prev && prev.variant !== preferredVariant ? null : prev,
        )
    }, [preferredVariant])

    const { data, isLoading, isError, error, isFetching, refetch } =
        useGetRecibosModificables({
            access,
            enabled: Boolean(access),
            page,
            page_size: PAGE_SIZE,
            comprobante_id: applied.comprobante_id,
            serie: applied.serie,
            numero: applied.numero,
            aceptada_sunat: applied.aceptada_sunat,
            fecha_emision_desde: applied.fecha_emision_desde,
            fecha_emision_hasta: applied.fecha_emision_hasta,
            kardex: applied.kardex,
            has_kardex: applied.has_kardex,
            persona_documento: applied.persona_documento,
            persona_nombres: applied.persona_nombres,
            usuario: applied.usuario,
        })

    const results = data?.results ?? []
    const totalCount = data?.count ?? results.length

    const hasFilters = useMemo(
        () => Object.values(applied).some((value) => value.trim() !== ""),
        [applied],
    )

    const patchDraft = <K extends keyof DraftFilters>(key: K, value: DraftFilters[K]) => {
        setDraft((prev) => ({ ...prev, [key]: value }))
    }

    /** Button-group filters apply immediately so the query key updates now. */
    const applyToggle = <K extends keyof DraftFilters>(key: K, value: DraftFilters[K]) => {
        setDraft((prev) => ({ ...prev, [key]: value }))
        setApplied((prev) => ({ ...prev, [key]: value }))
        setPage(1)
    }

    const handleApply = (e: React.FormEvent) => {
        e.preventDefault()
        setPage(1)
        setApplied({ ...draft })
    }

    const handleClear = () => {
        const cleared = emptyDraft()
        setDraft(cleared)
        setApplied(cleared)
        setPage(1)
    }

    return (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">{description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                        {totalCount} comprobante{totalCount === 1 ? "" : "s"}
                    </span>
                    <button
                        type="button"
                        onClick={() => void refetch()}
                        disabled={isFetching}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
                            aria-hidden
                        />
                        Actualizar
                    </button>
                </div>
            </div>

            <form
                onSubmit={handleApply}
                className="space-y-4 border-b border-slate-100 bg-slate-50/60 px-4 py-4"
            >
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-sky-600" aria-hidden />
                        <p className="text-sm font-semibold text-slate-800">Filtros</p>
                    </div>
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
                        >
                            <X className="h-3 w-3" aria-hidden />
                            Limpiar todo
                        </button>
                    )}
                </div>

                <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Tipo de comprobante
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { value: "", label: "Todos" },
                            {
                                value: String(RECIBO_COMPROBANTE_FACTURA),
                                label: "Factura",
                            },
                            {
                                value: String(RECIBO_COMPROBANTE_BOLETA),
                                label: "Boleta",
                            },
                        ].map((option) => {
                            const active = draft.comprobante_id === option.value
                            return (
                                <button
                                    key={option.value || "all-comprobante"}
                                    type="button"
                                    onClick={() =>
                                        applyToggle("comprobante_id", option.value)
                                    }
                                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                                        active
                                            ? "border-sky-600 bg-sky-600 text-white"
                                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Aceptada SUNAT
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { value: "", label: "Todos" },
                            { value: "true", label: "Sí (aceptada)" },
                            { value: "false", label: "No (no aceptada)" },
                        ].map((option) => {
                            const active = draft.aceptada_sunat === option.value
                            return (
                                <button
                                    key={option.value || "all-sunat"}
                                    type="button"
                                    onClick={() =>
                                        applyToggle(
                                            "aceptada_sunat",
                                            option.value as TriState,
                                        )
                                    }
                                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                                        active
                                            ? "border-amber-600 bg-amber-600 text-white"
                                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Relación con kardex
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { value: "", label: "Todos" },
                            { value: "true", label: "Con kardex" },
                            { value: "false", label: "Sin kardex" },
                        ].map((option) => {
                            const active = draft.has_kardex === option.value
                            return (
                                <button
                                    key={option.value || "all-kardex"}
                                    type="button"
                                    onClick={() =>
                                        applyToggle("has_kardex", option.value as TriState)
                                    }
                                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                                        active
                                            ? "border-emerald-600 bg-emerald-600 text-white"
                                            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                    }`}
                                >
                                    {option.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <label className="block text-xs font-semibold text-slate-600">
                        Serie
                        <span className="ml-1 font-normal text-slate-400">(parcial)</span>
                        <input
                            value={draft.serie}
                            onChange={(e) =>
                                patchDraft("serie", e.target.value.toUpperCase())
                            }
                            placeholder="Ej. F001"
                            className={`${inputClassName} font-mono`}
                        />
                    </label>

                    <label className="block text-xs font-semibold text-slate-600">
                        Número
                        <span className="ml-1 font-normal text-slate-400">(exacto)</span>
                        <input
                            value={draft.numero}
                            onChange={(e) =>
                                patchDraft("numero", e.target.value.replace(/\D/g, ""))
                            }
                            inputMode="numeric"
                            placeholder="Ej. 125"
                            className={`${inputClassName} font-mono`}
                        />
                    </label>

                    <label className="block text-xs font-semibold text-slate-600">
                        Kardex
                        <span className="ml-1 font-normal text-slate-400">(exacto)</span>
                        <input
                            value={draft.kardex}
                            onChange={(e) => patchDraft("kardex", e.target.value)}
                            placeholder="Ej. A143-2026"
                            className={`${inputClassName} font-mono`}
                        />
                    </label>

                    <label className="block text-xs font-semibold text-slate-600">
                        Fecha emisión desde
                        <input
                            type="date"
                            value={draft.fecha_emision_desde}
                            onChange={(e) =>
                                patchDraft("fecha_emision_desde", e.target.value)
                            }
                            className={inputClassName}
                        />
                    </label>

                    <label className="block text-xs font-semibold text-slate-600">
                        Fecha emisión hasta
                        <input
                            type="date"
                            value={draft.fecha_emision_hasta}
                            min={draft.fecha_emision_desde || undefined}
                            onChange={(e) =>
                                patchDraft("fecha_emision_hasta", e.target.value)
                            }
                            className={inputClassName}
                        />
                    </label>

                    <label className="block text-xs font-semibold text-slate-600">
                        Documento cliente
                        <span className="ml-1 font-normal text-slate-400">(contiene)</span>
                        <input
                            value={draft.persona_documento}
                            onChange={(e) =>
                                patchDraft(
                                    "persona_documento",
                                    e.target.value.replace(/\D/g, ""),
                                )
                            }
                            inputMode="numeric"
                            placeholder="DNI / RUC"
                            className={`${inputClassName} font-mono`}
                        />
                    </label>

                    <label className="block text-xs font-semibold text-slate-600">
                        Nombre cliente
                        <span className="ml-1 font-normal text-slate-400">(contiene)</span>
                        <input
                            value={draft.persona_nombres}
                            onChange={(e) =>
                                patchDraft("persona_nombres", e.target.value)
                            }
                            placeholder="Nombre o razón social"
                            className={inputClassName}
                        />
                    </label>

                    <label className="block text-xs font-semibold text-slate-600 sm:col-span-2">
                        Usuario emisor
                        <span className="ml-1 font-normal text-slate-400">(contiene)</span>
                        <input
                            value={draft.usuario}
                            onChange={(e) => patchDraft("usuario", e.target.value)}
                            placeholder="Username o nombre"
                            className={inputClassName}
                        />
                    </label>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="submit"
                        className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                        Aplicar filtros
                    </button>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Limpiar
                    </button>
                </div>
            </form>

            {isLoading && (
                <p className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Cargando comprobantes modificables…
                </p>
            )}

            {isError && (
                <p className="m-4 rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                    {error instanceof Error
                        ? error.message
                        : "No se pudieron cargar los comprobantes modificables."}
                </p>
            )}

            {!isLoading && !isError && results.length === 0 && (
                <p className="py-10 text-center text-sm text-slate-500">
                    {hasFilters
                        ? "No hay comprobantes modificables para los filtros aplicados."
                        : "No hay facturas ni boletas modificables por ahora."}
                </p>
            )}

            {!isLoading && !isError && results.length > 0 && (
                <>
                    <div className="space-y-3 p-4">
                        {results.map((item) => (
                            <ReciboModificableCard
                                key={item.id_recibo}
                                recibo={item}
                                preferredVariant={preferredVariant}
                                openVariant={
                                    openForm?.id_recibo === item.id_recibo
                                        ? openForm.variant
                                        : null
                                }
                                onOpenVariant={(variant) => {
                                    if (!variant) {
                                        setOpenForm(null)
                                        return
                                    }
                                    setOpenForm({
                                        id_recibo: item.id_recibo,
                                        variant,
                                    })
                                }}
                                onCreated={() => {
                                    setOpenForm(null)
                                    void refetch()
                                }}
                            />
                        ))}
                    </div>

                    {totalCount > PAGE_SIZE && (
                        <Paginator
                            page={page}
                            setPage={setPage}
                            itemsCount={totalCount}
                            itemsPerPage={PAGE_SIZE}
                        />
                    )}
                </>
            )}
        </section>
    )
}

export default RecibosModificablesList
