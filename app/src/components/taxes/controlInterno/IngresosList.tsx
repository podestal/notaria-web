import type { Dispatch, SetStateAction } from "react"
import useAuthStore from "../../../store/useAuthStore"
import useGetIngresos from "../../../hooks/taxes/ingresos/useGetIngresos"
import type { Ingreso } from "../../../services/taxes/ingresosService"
import Paginator from "../../ui/Paginator"
import IngresoCard from "./IngresoCard"

interface Props {
    page: number
    setPage: Dispatch<SetStateAction<number>>
    fecha_emision_desde: string
    fecha_emision_hasta: string
    persona_documento: string
    persona_nombres: string
    usuario: string
    hasFilters: boolean
    onEdit?: (ingreso: Ingreso) => void
    onAnular?: (ingreso: Ingreso) => void
}

const IngresosList = ({
    page,
    setPage,
    fecha_emision_desde,
    fecha_emision_hasta,
    persona_documento,
    persona_nombres,
    usuario,
    hasFilters,
    onEdit,
    onAnular,
}: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { data, isLoading, isError, error, isFetching } = useGetIngresos({
        access,
        page,
        fecha_emision_desde,
        fecha_emision_hasta,
        persona_documento,
        persona_nombres,
        usuario,
    })

    const results = data?.results ?? []
    const itemsCount = data?.count ?? 0

    return (
        <div className="mt-4 space-y-4">
            {itemsCount > 0 && (
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800">
                    <span>
                        {itemsCount} ingreso{itemsCount === 1 ? "" : "s"} registrado
                        {itemsCount === 1 ? "" : "s"}
                    </span>
                    {isFetching && !isLoading && (
                        <span className="font-normal text-slate-500">Actualizando…</span>
                    )}
                </div>
            )}

            {isLoading && (
                <p className="py-10 text-center text-sm text-slate-500 animate-pulse">
                    Cargando ingresos…
                </p>
            )}

            {isError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                    {error instanceof Error
                        ? error.message
                        : "No se pudieron cargar los ingresos."}
                </p>
            )}

            {!isLoading && !isError && results.length === 0 && (
                <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 py-10 text-center text-sm text-slate-500">
                    {hasFilters
                        ? "No hay ingresos que coincidan con estos filtros."
                        : "No hay ingresos registrados."}
                </p>
            )}

            {!isLoading && results.length > 0 && (
                <ul className="space-y-3">
                    {results.map((ingreso) => (
                        <li key={ingreso.id_ingreso}>
                            <IngresoCard
                                ingreso={ingreso}
                                onEdit={onEdit}
                                onAnular={onAnular}
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

export default IngresosList
