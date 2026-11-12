import { useEffect, useState, type ReactNode } from "react"
import TopModal from "../../../ui/TopModal"
import PreKardexForm from "../../reportes/registrosUif/PreKardexForm"
import useGetComplianceKardexErrors from "../../../../hooks/compliance/useGetComplianceKardexErrors"
import useAuthStore from "../../../../store/useAuthStore"
import ComplianceKardexErrorsPanel from "./ComplianceKardexErrorsPanel"
import KardexLogsPanel from "../KardexLogsPanel"
import KardexModalSideShell, {
    type KardexModalSideView,
} from "../KardexModalSideShell"

interface Props {
    isOpen: boolean
    onClose: () => void
    idkardex: number
    kardex: string
    portal?: boolean
    deepth?: number
    /** Extra chrome (e.g. SISGEN pointer styles) inside the modal body. */
    beforeSide?: ReactNode
    /** Called after compliance errors are refreshed successfully. */
    onErrorsRefreshed?: () => void | Promise<void>
}

const ComplianceKardexModal = ({
    isOpen,
    onClose,
    idkardex,
    kardex,
    portal = true,
    deepth,
    beforeSide,
    onErrorsRefreshed,
}: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const [sideView, setSideView] = useState<KardexModalSideView>("errors")

    useEffect(() => {
        if (isOpen) setSideView("errors")
    }, [isOpen, idkardex])

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
        enabled: isOpen && Boolean(kardex),
    })

    const isRefreshing = isFetching && !isLoading

    const handleRefresh = async () => {
        await refetch()
        await onErrorsRefreshed?.()
    }

    const errorsSlot = (
        <>
            {isLoading && (
                <aside className="flex h-full min-h-[8rem] items-center justify-center p-4 text-xs text-slate-500">
                    Cargando errores...
                </aside>
            )}
            {isError && !data && (
                <aside className="flex h-full min-h-[8rem] flex-col items-center justify-center gap-2 bg-red-50 p-4 text-xs text-red-700">
                    <p className="text-center">
                        {error?.message || "No se pudieron cargar los errores."}
                    </p>
                    <button
                        type="button"
                        onClick={handleRefresh}
                        className="cursor-pointer rounded-lg border border-red-300 bg-white px-2 py-1 text-[10px] font-semibold hover:bg-red-50"
                    >
                        Reintentar
                    </button>
                </aside>
            )}
            {data && (
                <ComplianceKardexErrorsPanel
                    data={data}
                    className="h-full border-0 bg-transparent"
                    onRefresh={handleRefresh}
                    isRefreshing={isRefreshing}
                />
            )}
            {!isLoading && !isError && !data && (
                <aside className="flex h-full min-h-[8rem] items-center justify-center p-4 text-xs text-slate-500">
                    Sin datos de errores.
                </aside>
            )}
        </>
    )

    return (
        <TopModal isOpen={isOpen} onClose={onClose} wide portal={portal} deepth={deepth}>
            <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row lg:gap-0">
                {beforeSide}
                <KardexModalSideShell
                    view={sideView}
                    onViewChange={setSideView}
                    errors={errorsSlot}
                    history={
                        <KardexLogsPanel
                            idkardex={idkardex}
                            enabled={isOpen && idkardex > 0}
                            className="h-full border-0 bg-transparent lg:border-0"
                        />
                    }
                />

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
