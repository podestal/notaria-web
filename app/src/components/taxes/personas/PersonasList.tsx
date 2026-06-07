import type { Dispatch, SetStateAction } from "react"
import useAuthStore from "../../../store/useAuthStore"
import useGetPersonas from "../../../hooks/taxes/personas/useGetPersonas"
import Paginator from "../../ui/Paginator"
import PersonaCard from "./PersonaCard"

interface Props {
    page: number
    setPage: Dispatch<SetStateAction<number>>
    nombres: string
    apellido_paterno: string
    apellido_materno: string
    razon_social: string
    numero_documento: string
    documento: string
    hasFilters: boolean
}

const PersonasList = ({
    page,
    setPage,
    nombres,
    apellido_paterno,
    apellido_materno,
    razon_social,
    numero_documento,
    documento,
    hasFilters,
}: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { data, isLoading, isError, error, isFetching } = useGetPersonas({
        access,
        page,
        nombres,
        apellido_paterno,
        apellido_materno,
        razon_social,
        numero_documento,
        documento,
    })

    const results = data?.results ?? []
    const itemsCount = data?.count ?? 0

    return (
        <div className="mt-4 space-y-4">
            {itemsCount > 0 && (
                <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800">
                    <span>
                        {itemsCount} persona{itemsCount === 1 ? "" : "s"} registrada
                        {itemsCount === 1 ? "" : "s"}
                    </span>
                    {isFetching && !isLoading && (
                        <span className="font-normal text-slate-500">Actualizando…</span>
                    )}
                </div>
            )}

            {isLoading && (
                <p className="py-10 text-center text-sm text-slate-500 animate-pulse">
                    Cargando personas…
                </p>
            )}

            {isError && (
                <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                    {error instanceof Error
                        ? error.message
                        : "No se pudieron cargar las personas."}
                </p>
            )}

            {!isLoading && !isError && results.length === 0 && (
                <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 py-10 text-center text-sm text-slate-500">
                    {hasFilters
                        ? "No hay personas que coincidan con estos filtros."
                        : "No hay personas registradas."}
                </p>
            )}

            {!isLoading && results.length > 0 && (
                <ul className="space-y-3">
                    {results.map((persona) => (
                        <li key={persona.id_persona}>
                            <PersonaCard persona={persona} />
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

export default PersonasList
