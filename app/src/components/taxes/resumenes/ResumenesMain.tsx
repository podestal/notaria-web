import { useState } from "react"
import { FileStack, Plus } from "lucide-react"
import GenerarResumenModal from "./GenerarResumenModal"
import ResumenesList from "./ResumenesList"

const ResumenesMain = () => {
    const [page, setPage] = useState(1)
    const [openGenerarModal, setOpenGenerarModal] = useState(false)

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <header className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-sky-100 pb-3">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-2">
                        <FileStack className="h-5 w-5 text-sky-600" aria-hidden />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-slate-800">Resúmenes</h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Lotes de comprobantes enviados a SUNAT y su estado de aceptación.
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setOpenGenerarModal(true)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                    <Plus className="h-3.5 w-3.5" aria-hidden />
                    Generar Resumen
                </button>
            </header>

            <ResumenesList page={page} setPage={setPage} />

            <GenerarResumenModal
                isOpen={openGenerarModal}
                onClose={() => setOpenGenerarModal(false)}
                onCreated={() => setPage(1)}
            />
        </section>
    )
}

export default ResumenesMain
