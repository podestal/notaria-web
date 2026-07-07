import TopModal from "../../../ui/TopModal"
import PreKardexForm from "../../reportes/registrosUif/PreKardexForm"
import useGetComplianceKardexErrors from "../../../../hooks/compliance/useGetComplianceKardexErrors"
import useAuthStore from "../../../../store/useAuthStore"
import ComplianceKardexErrorsPanel from "./ComplianceKardexErrorsPanel"
import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { invalidateComplianceQueries } from "../../../../hooks/compliance/invalidateComplianceQueries"

interface Props {
    isOpen: boolean
    onClose: () => void
    idkardex: number
    kardex: string
}

const ComplianceKardexModal = ({ isOpen, onClose, idkardex, kardex }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const queryClient = useQueryClient()

    useEffect(() => {
        if (!isOpen) return

        return queryClient.getMutationCache().subscribe((event) => {
            if (
                event.type === "updated" &&
                event.action.type === "success" &&
                event.mutation.state.status === "success"
            ) {
                void invalidateComplianceQueries(queryClient)
            }
        })
    }, [isOpen, queryClient])

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useGetComplianceKardexErrors({
        access,
        kardex,
        enabled: isOpen,
    })

    const isRefreshing = isFetching && !isLoading

    return (
        <TopModal isOpen={isOpen} onClose={onClose} wide portal deepth={45}>
            <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row lg:gap-0">
                <div className="flex max-h-[32vh] shrink-0 flex-col lg:max-h-none lg:w-72">
                    {isLoading && (
                        <aside className="flex h-full min-h-[8rem] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 lg:rounded-none lg:border-r lg:border-y-0">
                            Cargando errores...
                        </aside>
                    )}
                    {isError && !data && (
                        <aside className="flex h-full min-h-[8rem] flex-col items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700 lg:rounded-none lg:border-r lg:border-y-0">
                            <p className="text-center">
                                {error?.message || "No se pudieron cargar los errores."}
                            </p>
                            <button
                                type="button"
                                onClick={() => refetch()}
                                className="rounded-lg border border-red-300 bg-white px-2 py-1 text-[10px] font-semibold hover:bg-red-50"
                            >
                                Reintentar
                            </button>
                        </aside>
                    )}
                    {data && (
                        <ComplianceKardexErrorsPanel
                            data={data}
                            className="h-full lg:max-h-none"
                            onRefresh={() => refetch()}
                            isRefreshing={isRefreshing}
                        />
                    )}
                </div>

                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-auto lg:pl-4">
                    {idkardex > 0 && (
                        <PreKardexForm isOpen={isOpen} kardexId={idkardex} />
                    )}
                </main>
            </div>
        </TopModal>
    )
}

export default ComplianceKardexModal
