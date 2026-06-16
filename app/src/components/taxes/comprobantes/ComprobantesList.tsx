import type { Dispatch, SetStateAction } from "react"
import useAuthStore from "../../../store/useAuthStore"
import useGetIngresos from "../../../hooks/taxes/ingresos/useGetIngresos"
import useGetRecibos from "../../../hooks/taxes/recibos/useGetRecibos"
import Paginator from "../../ui/Paginator"
import type { KardexPresenceFilter } from "../controlInterno/IngresosFilters"
import ComprobanteCard from "./ComprobanteCard"
import {
    type ComprobanteItem,
    type ComprobanteVariant,
    getComprobanteItemId,
} from "./comprobanteTypes"

interface Props {
    variant: ComprobanteVariant
    comprobante?: number
    entityLabel: string
    entityLabelPlural: string
    page: number
    setPage: Dispatch<SetStateAction<number>>
    fecha_emision_desde: string
    fecha_emision_hasta: string
    persona_documento: string
    persona_nombres: string
    kardex: string
    has_kardex: KardexPresenceFilter
    usuario: string
    hasFilters: boolean
    onEdit?: (item: ComprobanteItem) => void
    onImprimir?: (item: ComprobanteItem) => void
    onAnular?: (item: ComprobanteItem) => void
    onCanjear?: (item: ComprobanteItem) => void
}

const ComprobantesList = ({
    variant,
    comprobante,
    entityLabel,
    entityLabelPlural,
    page,
    setPage,
    fecha_emision_desde,
    fecha_emision_hasta,
    persona_documento,
    persona_nombres,
    kardex,
    has_kardex,
    usuario,
    hasFilters,
    onEdit,
    onImprimir,
    onAnular,
    onCanjear,
}: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""

    const ingresosQuery = useGetIngresos({
        access,
        page,
        fecha_emision_desde,
        fecha_emision_hasta,
        persona_documento,
        persona_nombres,
        kardex,
        has_kardex,
        usuario,
        enabled: variant === "ingreso",
    })

    const recibosQuery = useGetRecibos({
        access,
        page,
        comprobante,
        fecha_emision_desde,
        fecha_emision_hasta,
        persona_documento,
        persona_nombres,
        kardex,
        has_kardex,
        usuario,
        enabled: variant === "recibo",
    })

    const { data, isLoading, isError, error, isFetching } =
        variant === "ingreso" ? ingresosQuery : recibosQuery

    const results = (data?.results ?? []) as ComprobanteItem[]
    const itemsCount = data?.count ?? 0

    return (
        <div className="mt-4 space-y-4">
            {itemsCount > 0 && (
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800">
                    <span>
                        {itemsCount} {itemsCount === 1 ? entityLabel : entityLabelPlural}{" "}
                        registrado{itemsCount === 1 ? "" : "s"}
                    </span>
                    {isFetching && !isLoading && (
                        <span className="font-normal text-slate-500">Actualizando…</span>
                    )}
                </div>
            )}

            {isLoading && (
                <p className="py-10 text-center text-sm text-slate-500 animate-pulse">
                    Cargando {entityLabelPlural}…
                </p>
            )}

            {isError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                    {error instanceof Error
                        ? error.message
                        : `No se pudieron cargar los ${entityLabelPlural}.`}
                </p>
            )}

            {!isLoading && !isError && results.length === 0 && (
                <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 py-10 text-center text-sm text-slate-500">
                    {hasFilters
                        ? `No hay ${entityLabelPlural} que coincidan con estos filtros.`
                        : `No hay ${entityLabelPlural} registrados.`}
                </p>
            )}

            {!isLoading && results.length > 0 && (
                <ul className="space-y-3">
                    {results.map((item) => (
                        <li key={getComprobanteItemId(item)}>
                            <ComprobanteCard
                                variant={variant}
                                item={item}
                                onEdit={onEdit}
                                onImprimir={onImprimir}
                                onAnular={onAnular}
                                onCanjear={onCanjear}
                            />
                        </li>
                    ))}
                </ul>
            )}

            {!isLoading && !isError && itemsCount > 0 && (
                <Paginator
                    page={page}
                    setPage={setPage}
                    itemsCount={itemsCount}
                    itemsPerPage={10}
                />
            )}
        </div>
    )
}

export default ComprobantesList
