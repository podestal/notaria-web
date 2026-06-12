import type { Dispatch, SetStateAction } from "react"
import useAuthStore from "../../../store/useAuthStore"
import useGetResumenes from "../../../hooks/taxes/resumenes/useGetResumenes"
import Paginator from "../../ui/Paginator"
import ResumenCard from "./ResumenCard"

interface Props {
    page: number
    setPage: Dispatch<SetStateAction<number>>
}

const ResumenesList = ({ page, setPage }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { data, isLoading, isError, error, isFetching } = useGetResumenes({
        access,
        page,
    })

    const results = data?.results ?? []
    const itemsCount = data?.count ?? 0

    return (
        <div className="space-y-4">
            {itemsCount > 0 && (
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800">
                    <span>
                        {itemsCount} resumen{itemsCount === 1 ? "" : "es"} registrado
                        {itemsCount === 1 ? "" : "s"}
                    </span>
                    {isFetching && !isLoading && (
                        <span className="font-normal text-slate-500">Actualizando…</span>
                    )}
                </div>
            )}

            {isLoading && (
                <p className="py-10 text-center text-sm text-slate-500 animate-pulse">
                    Cargando resúmenes…
                </p>
            )}

            {isError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                    {error instanceof Error
                        ? error.message
                        : "No se pudieron cargar los resúmenes."}
                </p>
            )}

            {!isLoading && !isError && results.length === 0 && (
                <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 py-10 text-center text-sm text-slate-500">
                    No hay resúmenes registrados.
                </p>
            )}

            {!isLoading && results.length > 0 && (
                <ul className="space-y-3">
                    {results.map((resumen) => (
                        <li key={resumen.id_resumen}>
                            <ResumenCard resumen={resumen} />
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

export default ResumenesList
