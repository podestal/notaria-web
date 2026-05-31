import { useEffect, useState } from "react"
import TopModal from "../../ui/TopModal"
import PreKardexForm from "../reportes/registrosUif/PreKardexForm"
import useSisgenKardexErrors from "../../../hooks/sisgen/useSisgenKardexErrors"
import SisgenKardexErrorsPanel from "./SisgenKardexErrorsPanel"

interface Props {
    isOpen: boolean
    onClose: () => void
    idkardex: number
    kardex: string
}

const XL_MEDIA = "(min-width: 1280px)"

const SisgenKardexModal = ({ isOpen, onClose, idkardex, kardex }: Props) => {
    const [errorsOpen, setErrorsOpen] = useState(true)
    const { data, isLoading, isError, error } = useSisgenKardexErrors({
        idkardex,
        kardex,
        enabled: isOpen,
    })

    useEffect(() => {
        if (!isOpen) return
        const mq = window.matchMedia(XL_MEDIA)
        setErrorsOpen(mq.matches)
        const onChange = (e: MediaQueryListEvent) => setErrorsOpen(e.matches)
        mq.addEventListener("change", onChange)
        return () => mq.removeEventListener("change", onChange)
    }, [isOpen])

    const errorCount = data?.sisgen_error_count ?? 0

    return (
        <TopModal isOpen={isOpen} onClose={onClose} wide>
            <div className="flex min-h-0 flex-1 flex-col">
                <div className="mb-2 shrink-0 border-b border-slate-100 pb-2">
                    <button
                        type="button"
                        onClick={() => setErrorsOpen((open) => !open)}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                    >
                        {errorsOpen
                            ? "Ocultar errores SISGEN"
                            : "Ver errores SISGEN"}
                        {errorCount > 0 && (
                            <span className="ml-1.5 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">
                                {errorCount}
                            </span>
                        )}
                    </button>
                </div>

                <div
                    className={`flex min-h-0 flex-1 ${
                        errorsOpen ? "flex-col gap-3 xl:flex-row xl:gap-0" : ""
                    }`}
                >
                    {errorsOpen && (
                        <>
                            {isLoading && (
                                <aside className="flex max-h-[28vh] shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500 xl:max-h-none xl:w-52 xl:rounded-none xl:border-r xl:border-y-0">
                                    Cargando errores SISGEN...
                                </aside>
                            )}
                            {isError && (
                                <aside className="flex max-h-[28vh] shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-700 xl:max-h-none xl:w-52">
                                    {error?.message ||
                                        "No se pudieron cargar los errores."}
                                </aside>
                            )}
                            {data && (
                                <SisgenKardexErrorsPanel
                                    data={data}
                                    className="max-h-[28vh] xl:max-h-none xl:w-52"
                                />
                            )}
                        </>
                    )}

                    <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-auto xl:pl-4">
                        <PreKardexForm isOpen={isOpen} kardexId={idkardex} />
                    </main>
                </div>
            </div>
        </TopModal>
    )
}

export default SisgenKardexModal
