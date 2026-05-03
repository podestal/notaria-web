import type { Dispatch, SetStateAction } from "react"
import useAuthStore from "../../../store/useAuthStore"
import useGetTemplates from "../../../hooks/api/templates/useGetTemplates"
import Paginator from "../../ui/Paginator"
import PlantillaCard from "./PlantillaCard"

interface Props {
    codeActs: string
    fkType: string
    nameTemplate: string
    page: number
    setPage: Dispatch<SetStateAction<number>>
    hideDelete?: boolean
}

const PantillaList = ({ codeActs, fkType, nameTemplate, page, setPage, hideDelete = false }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { data, isLoading, isError, error } = useGetTemplates({
        access,
        codeActs,
        fkType,
        nameTemplate,
        page,
    })

    const results = data?.results ?? []
    const itemsCount = data?.count ?? 0

    return (
        <div className="mt-8 space-y-4">
            {isLoading && (
                <p className="text-center text-sm text-slate-500">Cargando plantillas…</p>
            )}
            {isError && (
                <p className="text-center text-sm text-red-600">
                    {error instanceof Error ? error.message : "No se pudieron cargar las plantillas."}
                </p>
            )}
            {!isLoading && !isError && results.length === 0 && (
                <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/80 py-10 text-center text-sm text-slate-500">
                    No hay plantillas con estos filtros.
                </p>
            )}
            {!isLoading && results.length > 0 && (
                <ul className="space-y-3">
                    {results.map((template) => (
                        <li key={template.pktemplate}>
                            <PlantillaCard template={template} hideDelete={hideDelete} />
                        </li>
                    ))}
                </ul>
            )}

            {!isLoading && !isError && (
                <Paginator page={page} setPage={setPage} itemsCount={itemsCount} itemsPerPage={10} />
            )}
        </div>
    )
}

export default PantillaList
