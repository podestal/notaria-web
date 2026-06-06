import type { Dispatch, SetStateAction } from "react"
import useAuthStore from "../../../store/useAuthStore"
import useGetCatalog from "../../../hooks/taxes/useGetCatalog"
import type { Catalog } from "../../../services/taxes/catalogService"
import Paginator from "../../ui/Paginator"
import CatalogoCard from "./CatalogoCard"

interface Props {
    page: number
    setPage: Dispatch<SetStateAction<number>>
    codigo: string
    descripcion: string
    onEdit?: (catalog: Catalog) => void
}

const CatalogoList = ({ page, setPage, codigo, descripcion, onEdit }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { data, isLoading, isError, error, isFetching } = useGetCatalog({
        access,
        page,
        codigo,
        descripcion,
    })

    const results = data?.results ?? []
    const itemsCount = data?.count ?? 0

    return (
        <div className="mt-4 space-y-4">
            {itemsCount > 0 && (
                <div className="flex items-center justify-between rounded-lg bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-800">
                    <span>
                        {itemsCount} ítem{itemsCount === 1 ? "" : "s"} en catálogo
                    </span>
                    {isFetching && !isLoading && (
                        <span className="font-normal text-slate-500">Actualizando…</span>
                    )}
                </div>
            )}

            {isLoading && (
                <p className="py-10 text-center text-sm text-slate-500 animate-pulse">
                    Cargando catálogo…
                </p>
            )}

            {isError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                    {error instanceof Error
                        ? error.message
                        : "No se pudo cargar el catálogo."}
                </p>
            )}

            {!isLoading && !isError && results.length === 0 && (
                <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 py-10 text-center text-sm text-slate-500">
                    No hay ítems en el catálogo con estos filtros.
                </p>
            )}

            {!isLoading && results.length > 0 && (
                <ul className="space-y-3">
                    {results.map((catalog) => (
                        <li key={catalog.id_catalogo}>
                            <CatalogoCard catalog={catalog} onEdit={onEdit} />
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

export default CatalogoList
