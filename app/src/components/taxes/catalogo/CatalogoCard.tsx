import { Package } from "lucide-react"
import type { Catalog } from "../../../services/taxes/catalogService"
import getTitleCase from "../../../utils/getTitleCase"

interface Props {
    catalog: Catalog
    onEdit?: (catalog: Catalog) => void
}

const formatAmount = (value: string) => {
    const n = Number(value)
    if (Number.isNaN(n)) return value || "—"
    return n.toLocaleString("es-PE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

const formatDate = (iso: string) => {
    if (!iso) return "—"
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
}

const getCodigoUnitarioLabel = (
    codigoUnitario: Catalog["codigo_unitario"],
) => {
    if (!codigoUnitario) return ""
    if (typeof codigoUnitario === "string") return codigoUnitario
    return codigoUnitario.codigo || codigoUnitario.descripcion || ""
}

const CatalogoCard = ({ catalog, onEdit }: Props) => {
    const codigoUnitarioLabel = getCodigoUnitarioLabel(catalog.codigo_unitario)
    return (
        <article className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 gap-3">
                    <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-2">
                        <Package className="h-5 w-5 text-sky-600" aria-hidden />
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold">
                                {catalog.codigo || "—"}
                            </span>
                            {codigoUnitarioLabel && (
                                <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                                    Ud. {codigoUnitarioLabel}
                                </span>
                            )}
                        </div>
                        <h3 className="mt-1 text-sm font-medium leading-snug text-slate-900">
                            {getTitleCase(catalog.descripcion || "Sin descripción")}
                        </h3>
                    </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2 text-right text-xs">
                    <div>
                        <p className="text-slate-500">Precio unitario</p>
                        <p className="text-base font-semibold text-slate-900">
                            S/ {formatAmount(catalog.precio_unitario)}
                        </p>
                        <p className="text-[10px] text-slate-400">
                            Valor: S/ {formatAmount(catalog.valor_unitario)}
                        </p>
                    </div>
                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(catalog)}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Editar
                        </button>
                    )}
                </div>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-[11px] sm:grid-cols-4">
                {/* <div>
                    <dt className="text-slate-500">Tipo IGV</dt>
                    <dd className="font-medium text-slate-800">{catalog.tipo_igv_id}</dd>
                </div>
                <div>
                    <dt className="text-slate-500">Moneda</dt>
                    <dd className="font-medium text-slate-800">{catalog.moneda_id}</dd>
                </div> */}
                <div>
                    <dt className="text-slate-500">Creado</dt>
                    <dd className="font-medium text-slate-800">{formatDate(catalog.creado)}</dd>
                </div>
                <div>
                    <dt className="text-slate-500">Actualizado</dt>
                    <dd className="font-medium text-slate-800">{formatDate(catalog.actualizado)}</dd>
                </div>
            </dl>
        </article>
    )
}

export default CatalogoCard
