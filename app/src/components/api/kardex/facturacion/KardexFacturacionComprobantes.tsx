import { ClipboardList, Receipt } from "lucide-react"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import useAuthStore from "../../../../store/useAuthStore"
import useGetIngresos from "../../../../hooks/taxes/ingresos/useGetIngresos"
import useGetRecibos from "../../../../hooks/taxes/recibos/useGetRecibos"
import type { Ingreso } from "../../../../services/taxes/ingresosService"
import AnularComprobanteModal from "../../../taxes/comprobantes/AnularComprobanteModal"
import ComprobantePdfModal from "../../../taxes/comprobantes/ComprobantePdfModal"
import {
    type ComprobanteItem,
    type ComprobanteVariant,
    getComprobanteItemId,
    isIngreso,
    isRecibo,
} from "../../../taxes/comprobantes/comprobanteTypes"
import CanjearIngresoModal from "../../../taxes/controlInterno/CanjearIngresoModal"
import Paginator from "../../../ui/Paginator"
import KardexComprobanteCard from "./KardexComprobanteCard"

interface Props {
    kardexCode: string
}

interface SummaryChipProps {
    label: string
    count: number
    icon: typeof ClipboardList
    className: string
}

const SummaryChip = ({ label, count, icon: Icon, className }: SummaryChipProps) => {
    if (count <= 0) return null

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${className}`}
        >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {count} {label}
        </span>
    )
}

const KardexFacturacionComprobantes = ({ kardexCode }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const queryClient = useQueryClient()
    const [ingresosPage, setIngresosPage] = useState(1)
    const [recibosPage, setRecibosPage] = useState(1)
    const [printing, setPrinting] = useState<{
        variant: ComprobanteVariant
        item: ComprobanteItem
    } | null>(null)
    const [anulando, setAnulando] = useState<{
        variant: ComprobanteVariant
        item: ComprobanteItem
    } | null>(null)
    const [canjeando, setCanjeando] = useState<Ingreso | null>(null)

    const ingresosQuery = useGetIngresos({
        access,
        page: ingresosPage,
        kardex: kardexCode,
        enabled: Boolean(kardexCode.trim()),
    })

    const recibosQuery = useGetRecibos({
        access,
        page: recibosPage,
        kardex: kardexCode,
        enabled: Boolean(kardexCode.trim()),
    })

    const ingresos = ingresosQuery.data?.results ?? []
    const recibos = recibosQuery.data?.results ?? []
    const ingresosCount = ingresosQuery.data?.count ?? 0
    const recibosCount = recibosQuery.data?.count ?? 0
    const totalCount = ingresosCount + recibosCount
    const isLoading = ingresosQuery.isLoading || recibosQuery.isLoading
    const isError = ingresosQuery.isError || recibosQuery.isError
    const errorMessage =
        ingresosQuery.error?.message || recibosQuery.error?.message || ""

    const refreshLists = () => {
        void queryClient.invalidateQueries({ queryKey: ["taxes-ingresos"] })
        void queryClient.invalidateQueries({ queryKey: ["taxes-recibos"] })
    }

    if (isLoading) {
        return (
            <p className="text-sm text-slate-500 animate-pulse">
                Cargando comprobantes del kardex…
            </p>
        )
    }

    if (isError) {
        return (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {errorMessage || "No se pudieron cargar los comprobantes de este kardex."}
            </p>
        )
    }

    if (totalCount === 0) {
        return (
            <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-6 text-center">
                <p className="text-sm font-medium text-slate-700">
                    Sin comprobantes en este kardex
                </p>
                <p className="mt-1 text-xs text-slate-500">
                    Los documentos que emita aparecerán aquí antes de crear uno nuevo.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
                <p className="text-sm font-semibold text-slate-800">
                    {totalCount} documento{totalCount === 1 ? "" : "s"} en este kardex
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                    <SummaryChip
                        label={ingresosCount === 1 ? "control interno" : "controles internos"}
                        count={ingresosCount}
                        icon={ClipboardList}
                        className="bg-indigo-100 text-indigo-800"
                    />
                    <SummaryChip
                        label={
                            recibosCount === 1
                                ? "boleta o factura"
                                : "boletas y facturas"
                        }
                        count={recibosCount}
                        icon={Receipt}
                        className="bg-emerald-100 text-emerald-800"
                    />
                </div>
            </div>

            {ingresosCount > 0 && (
                <section className="space-y-2">
                    <header className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100 text-indigo-700">
                            <ClipboardList className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wide text-indigo-800">
                            Control interno
                        </h4>
                        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                            {ingresosCount}
                        </span>
                    </header>
                    <ul className="grid gap-3 sm:grid-cols-2">
                        {ingresos.map((item) => (
                            <li key={getComprobanteItemId(item)}>
                                <KardexComprobanteCard
                                    variant="ingreso"
                                    item={item}
                                    onImprimir={(ingreso) =>
                                        setPrinting({ variant: "ingreso", item: ingreso })
                                    }
                                    onAnular={(ingreso) =>
                                        setAnulando({ variant: "ingreso", item: ingreso })
                                    }
                                    onCanjear={(ingreso) => {
                                        if (isIngreso(ingreso)) setCanjeando(ingreso)
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                    {ingresosCount > 10 && (
                        <Paginator
                            page={ingresosPage}
                            setPage={setIngresosPage}
                            itemsCount={ingresosCount}
                        />
                    )}
                </section>
            )}

            {recibosCount > 0 && (
                <section className="space-y-2">
                    <header className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-700">
                            <Receipt className="h-3.5 w-3.5" aria-hidden />
                        </span>
                        <h4 className="text-xs font-bold uppercase tracking-wide text-emerald-800">
                            Boletas y facturas
                        </h4>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            {recibosCount}
                        </span>
                    </header>
                    <ul className="grid gap-3 sm:grid-cols-2">
                        {recibos.map((item) => (
                            <li key={getComprobanteItemId(item)}>
                                <KardexComprobanteCard
                                    variant="recibo"
                                    item={item}
                                    onImprimir={(recibo) =>
                                        setPrinting({ variant: "recibo", item: recibo })
                                    }
                                    onAnular={(recibo) =>
                                        setAnulando({ variant: "recibo", item: recibo })
                                    }
                                />
                            </li>
                        ))}
                    </ul>
                    {recibosCount > 10 && (
                        <Paginator
                            page={recibosPage}
                            setPage={setRecibosPage}
                            itemsCount={recibosCount}
                        />
                    )}
                </section>
            )}

            <ComprobantePdfModal
                variant={printing?.variant ?? "ingreso"}
                item={printing?.item ?? null}
                onClose={() => setPrinting(null)}
            />

            <AnularComprobanteModal
                variant={anulando?.variant ?? "ingreso"}
                item={anulando?.item ?? null}
                reciboComprobanteId={
                    anulando?.item && isRecibo(anulando.item)
                        ? anulando.item.comprobante
                        : undefined
                }
                onClose={() => setAnulando(null)}
                onSuccess={refreshLists}
            />

            <CanjearIngresoModal
                ingreso={canjeando}
                onClose={() => setCanjeando(null)}
                onSuccess={refreshLists}
            />
        </div>
    )
}

export default KardexFacturacionComprobantes
