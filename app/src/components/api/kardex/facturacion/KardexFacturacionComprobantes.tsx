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
            <p className="text-sm text-slate-500">
                Aún no hay comprobantes vinculados a este kardex.
            </p>
        )
    }

    return (
        <div className="space-y-4">
            <p className="text-xs text-slate-500">
                {totalCount} comprobante{totalCount === 1 ? "" : "s"} vinculado
                {totalCount === 1 ? "" : "s"} a este kardex.
            </p>

            {ingresosCount > 0 && (
                <section className="space-y-2">
                    <header className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Control interno
                        </h4>
                        <span className="text-[11px] text-slate-400">
                            {ingresosCount} ingreso{ingresosCount === 1 ? "" : "s"}
                        </span>
                    </header>
                    <ul className="space-y-2">
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
                    <header className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Recibos
                        </h4>
                        <span className="text-[11px] text-slate-400">
                            {recibosCount} recibo{recibosCount === 1 ? "" : "s"}
                        </span>
                    </header>
                    <ul className="space-y-2">
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
