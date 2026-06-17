import { useEffect, useRef, useState } from "react"
import { Trash2 } from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import useGetCatalog from "../../../hooks/taxes/useGetCatalog"
import type { Catalog } from "../../../services/taxes/catalogService"
import type { IngresoLineaPayload } from "../../../services/taxes/ingresosService"
import getTitleCase from "../../../utils/getTitleCase"
import { IGV_PERCENT_LABEL } from "../catalogo/catalogoFormShared"
import {
    calcLineaSubtotal,
    catalogToIngresoLinea,
    computeIngresoGravadaFromLineas,
    computeIngresoIgvFromLineas,
    computeIngresoTotalFromLineas,
    normalizeIngresoLineaPrecioUnitario,
    updateIngresoLineaCantidad,
    updateIngresoLineaPrecioUnitario,
} from "./ingresoFormShared"

interface Props {
    lineas: IngresoLineaPayload[]
    onChange: (lineas: IngresoLineaPayload[]) => void
    observaciones: string
    onObservacionesChange: (value: string) => void
    error?: string
}

const formatAmount = (value: string) => {
    const n = Number(value)
    if (Number.isNaN(n)) return value || "—"
    return n.toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

const getCatalogLabel = (catalog: Catalog) =>
    getTitleCase(catalog.descripcion || "Sin descripción")

const IngresoLineasLooker = ({
    lineas,
    onChange,
    observaciones,
    onObservacionesChange,
    error = "",
}: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const containerRef = useRef<HTMLDivElement>(null)

    const [query, setQuery] = useState("")
    const [debouncedQuery, setDebouncedQuery] = useState("")
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            setDebouncedQuery(query.trim())
        }, 300)
        return () => window.clearTimeout(timeout)
    }, [query])

    const { data, isLoading, isError, error: fetchError } = useGetCatalog({
        access,
        descripcion: debouncedQuery,
        enabled: debouncedQuery.length > 0,
    })

    const results = data?.results ?? []

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelectCatalog = (catalog: Catalog) => {
        onChange([...lineas, catalogToIngresoLinea(catalog)])
        setQuery("")
        setDebouncedQuery("")
        setOpen(false)
    }

    const handleQueryChange = (value: string) => {
        setQuery(value)
        setOpen(true)
    }

    const handleRemoveLinea = (index: number) => {
        onChange(lineas.filter((_, i) => i !== index))
    }

    const handleUpdateCantidad = (index: number, raw: string) => {
        const parsed = Number.parseInt(raw, 10)
        if (Number.isNaN(parsed) || parsed < 1) return

        onChange(
            lineas.map((linea, i) =>
                i === index ? updateIngresoLineaCantidad(linea, parsed) : linea,
            ),
        )
    }

    const handleUpdateDetalles = (index: number, detalles: string) => {
        onChange(
            lineas.map((linea, i) =>
                i === index ? { ...linea, detalles } : linea,
            ),
        )
    }

    const handleUpdatePrecioUnitario = (index: number, precio_unitario: string) => {
        onChange(
            lineas.map((linea, i) =>
                i === index
                    ? updateIngresoLineaPrecioUnitario(linea, precio_unitario)
                    : linea,
            ),
        )
    }

    const handleBlurPrecioUnitario = (index: number) => {
        onChange(
            lineas.map((linea, i) =>
                i === index ? normalizeIngresoLineaPrecioUnitario(linea) : linea,
            ),
        )
    }

    const gravada = computeIngresoGravadaFromLineas(lineas)
    const igv = computeIngresoIgvFromLineas(lineas)
    const total = computeIngresoTotalFromLineas(lineas)
    const showDropdown = open && debouncedQuery.length > 0

    return (
        <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
            <div>
                <h3 className="text-sm font-semibold text-slate-800">Conceptos</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                    Escriba para filtrar el catálogo y seleccione un concepto para agregarlo.
                </p>
            </div>

            <div className="space-y-3">
                <div className="grid w-full grid-cols-3 items-start gap-6">
                    <label className="pl-2 pt-2 text-xs font-semibold text-slate-700">
                        Concepto
                    </label>
                    <div ref={containerRef} className="relative col-span-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => handleQueryChange(e.target.value)}
                            onFocus={() => setOpen(true)}
                            placeholder="Escriba para buscar…"
                            className="min-w-64 w-full rounded-md border border-slate-300 bg-white py-2 px-3 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                        />

                        {showDropdown && (
                            <ul className="absolute z-30 mt-1 max-h-52 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                                {isLoading && (
                                    <li className="px-3 py-2 text-xs text-slate-500 animate-pulse">
                                        Buscando…
                                    </li>
                                )}

                                {isError && (
                                    <li className="px-3 py-2 text-xs text-red-600">
                                        {fetchError instanceof Error
                                            ? fetchError.message
                                            : "No se pudo cargar el catálogo."}
                                    </li>
                                )}

                                {!isLoading && !isError && results.length === 0 && (
                                    <li className="px-3 py-2 text-xs text-slate-500">
                                        No hay conceptos con ese texto.
                                    </li>
                                )}

                                {!isLoading &&
                                    results.map((catalog) => (
                                        <li key={catalog.id_catalogo}>
                                            <button
                                                type="button"
                                                onClick={() => handleSelectCatalog(catalog)}
                                                className="w-full px-3 py-2 text-left hover:bg-sky-50"
                                            >
                                                <span className="font-mono text-[10px] font-semibold text-slate-500">
                                                    {catalog.codigo || "—"}
                                                </span>
                                                <p className="text-sm font-medium text-slate-900">
                                                    {getCatalogLabel(catalog)}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    S/ {formatAmount(catalog.precio_unitario)} c/u
                                                </p>
                                            </button>
                                        </li>
                                    ))}
                            </ul>
                        )}

                    </div>
                </div>
            </div>

            {lineas.length > 0 && (
                <div className="space-y-4 border-t border-slate-200 pt-4">
                    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                        <table className="min-w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-100 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                                    <th className="px-2 py-2 w-12">Acción</th>
                                    <th className="px-2 py-2 w-16">Cantidad</th>
                                    <th className="px-2 py-2 min-w-[160px]">Descripción</th>
                                    <th className="px-2 py-2 min-w-[100px]">Detalles</th>
                                    <th className="px-2 py-2 w-24 text-right">
                                        Precio unitario
                                    </th>
                                    <th className="px-2 py-2 w-24 text-right">Subtotal</th>
                                    <th className="px-2 py-2 w-24 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lineas.map((linea, index) => (
                                    <tr
                                        key={`${linea.catalogo_id}-${index}`}
                                        className="border-b border-slate-100 last:border-b-0"
                                    >
                                        <td className="px-2 py-2 align-middle">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveLinea(index)}
                                                className="rounded-md border border-red-200 p-1 text-red-600 hover:bg-red-50"
                                                aria-label="Quitar línea"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                        <td className="px-2 py-2 align-middle">
                                            <input
                                                type="number"
                                                min={1}
                                                step={1}
                                                value={linea.cantidad}
                                                onChange={(e) =>
                                                    handleUpdateCantidad(
                                                        index,
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-14 rounded border border-slate-300 px-1.5 py-1 text-center text-xs text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200"
                                            />
                                        </td>
                                        <td className="px-2 py-2 align-middle text-slate-900">
                                            {getTitleCase(linea.descripcion)}
                                        </td>
                                        <td className="px-2 py-2 align-middle">
                                            <input
                                                type="text"
                                                value={linea.detalles}
                                                onChange={(e) =>
                                                    handleUpdateDetalles(
                                                        index,
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full min-w-[80px] rounded border border-slate-300 px-1.5 py-1 text-xs text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200"
                                            />
                                        </td>
                                        <td className="px-2 py-2 align-middle">
                                            <input
                                                type="number"
                                                min={0}
                                                step={0.01}
                                                value={linea.precio_unitario}
                                                onChange={(e) =>
                                                    handleUpdatePrecioUnitario(
                                                        index,
                                                        e.target.value,
                                                    )
                                                }
                                                onBlur={() =>
                                                    handleBlurPrecioUnitario(index)
                                                }
                                                className="w-full min-w-[72px] rounded border border-slate-300 px-1.5 py-1 text-right font-mono text-xs text-slate-800 outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200"
                                            />
                                        </td>
                                        <td className="px-2 py-2 align-middle text-right font-mono text-slate-800">
                                            {formatAmount(calcLineaSubtotal(linea))}
                                        </td>
                                        <td className="px-2 py-2 align-middle text-right font-mono font-semibold text-slate-900">
                                            {formatAmount(linea.total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block pl-1 text-xs font-semibold text-slate-700">
                                Observaciones
                            </label>
                            <textarea
                                value={observaciones}
                                onChange={(e) => onObservacionesChange(e.target.value)}
                                rows={3}
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                            />
                        </div>

                        <dl className="space-y-1 self-end text-sm">
                            <div className="flex justify-between gap-4 border-b border-slate-100 py-1">
                                <dt className="font-semibold text-slate-700">GRAVADA :</dt>
                                <dd className="font-mono text-slate-900">
                                    {formatAmount(gravada)}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4 border-b border-slate-100 py-1">
                                <dt className="font-semibold text-slate-700">
                                    {IGV_PERCENT_LABEL} :
                                </dt>
                                <dd className="font-mono text-slate-900">
                                    {formatAmount(igv)}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-4 py-1">
                                <dt className="font-bold text-slate-900">TOTAL :</dt>
                                <dd className="font-mono font-bold text-slate-900">
                                    {formatAmount(total)}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            )}

            {error && (
                <p className="text-xs font-medium text-red-600">{error}</p>
            )}
        </div>
    )
}

export default IngresoLineasLooker
