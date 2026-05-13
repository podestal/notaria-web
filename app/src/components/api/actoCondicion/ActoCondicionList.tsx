import type { Dispatch, SetStateAction } from "react"
import useAuthStore from "../../../store/useAuthStore"
import useGetActosPage from "../../../hooks/api/acto/useGetActosPage"
import Paginator from "../../ui/Paginator"
import ActoCondicionTable from "./ActoCondicionTable"
import ActoCondicionCard from "./ActoCondicionCard"

interface Props {
    desacto: string
    idtipoacto: string
    idtipkar: string
    page: number
    setPage: Dispatch<SetStateAction<number>>
}

const ActoCondicionList = ({ desacto, idtipoacto, idtipkar, page, setPage }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { data, isLoading, isError, error } = useGetActosPage({
        access,
        desacto,
        idtipoacto,
        idtipkar,
        page,
    })

    const results = data?.results ?? []
    const itemsCount = data?.count ?? 0

    return (
        <div className="mt-6 space-y-4">
            {isLoading && <p className="text-center text-sm text-slate-500">Cargando tipos de acto…</p>}
            {isError && (
                <p className="text-center text-sm text-red-600">
                    {error instanceof Error ? error.message : "No se pudieron cargar los actos."}
                </p>
            )}
            {!isLoading && !isError && results.length === 0 && (
                <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/80 py-10 text-center text-sm text-slate-500">
                    No hay actos con estos filtros.
                </p>
            )}
            {!isLoading && results.length > 0 && (
                <>
                    <div className="hidden md:block">
                        <ActoCondicionTable actos={results} />
                    </div>
                    <ul className="space-y-3 md:hidden">
                        {results.map((acto, index) => (
                            <li key={`${acto.idtipoacto}-${acto.idtipkar}-${index}`}>
                                <ActoCondicionCard acto={acto} />
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {!isLoading && !isError && <Paginator page={page} setPage={setPage} itemsCount={itemsCount} itemsPerPage={10} />}
        </div>
    )
}

export default ActoCondicionList
