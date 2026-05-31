import TopModal from "../../ui/TopModal"
import PreKardexForm from "../reportes/registrosUif/PreKardexForm"
import useRefreshLastSisgenSearch from "../../../hooks/sisgen/useRefreshLastSisgenSearch"
import useSisgenKardexErrors from "../../../hooks/sisgen/useSisgenKardexErrors"
import SisgenKardexErrorsPanel from "./SisgenKardexErrorsPanel"

interface Props {
    isOpen: boolean
    onClose: () => void
    idkardex: number
    kardex: string
    portal?: boolean
}

const SisgenKardexModal = ({
    isOpen,
    onClose,
    idkardex,
    kardex,
    portal = false,
}: Props) => {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useSisgenKardexErrors({
        kardex,
        enabled: isOpen,
    })

    const refreshLastSisgenSearch = useRefreshLastSisgenSearch()
    const isRefreshing = isFetching && !isLoading

    const handleVerifyErrors = async () => {
        await refetch()
        await refreshLastSisgenSearch()
    }

    return (
        <TopModal isOpen={isOpen} onClose={onClose} wide portal={portal}>
            <div className="flex min-h-0 flex-1 flex-col gap-3 xl:flex-row xl:gap-0">
                {isLoading && (
                    <aside className="flex max-h-[28vh] shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 xl:max-h-none xl:w-52 xl:rounded-none xl:border-r xl:border-y-0">
                        Cargando errores SISGEN...
                    </aside>
                )}
                {isError && !data && (
                    <aside className="flex max-h-[28vh] shrink-0 flex-col items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700 xl:max-h-none xl:w-52">
                        <p className="text-center">
                            {error?.message ||
                                "No se pudieron cargar los errores."}
                        </p>
                        <button
                            type="button"
                            onClick={handleVerifyErrors}
                            className="rounded-lg border border-red-300 bg-white px-2 py-1 text-[10px] font-semibold hover:bg-red-50"
                        >
                            Reintentar
                        </button>
                    </aside>
                )}
                {data && (
                    <SisgenKardexErrorsPanel
                        data={data}
                        className="max-h-[28vh] xl:max-h-none xl:w-52"
                        onRefresh={handleVerifyErrors}
                        isRefreshing={isRefreshing}
                    />
                )}

                <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-auto xl:pl-4">
                    <PreKardexForm isOpen={isOpen} kardexId={idkardex} />
                </main>
            </div>
        </TopModal>
    )
}

export default SisgenKardexModal
