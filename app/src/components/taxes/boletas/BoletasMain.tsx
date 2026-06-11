import { useEffect, useState } from "react"
import { FileText, Receipt } from "lucide-react"
import { RECIBO_COMPROBANTE_BOLETA } from "../../../services/taxes/recibosService"
import TopModal from "../../ui/TopModal"
import AnularComprobanteModal from "../comprobantes/AnularComprobanteModal"
import ComprobantePdfModal from "../comprobantes/ComprobantePdfModal"
import ComprobantesList from "../comprobantes/ComprobantesList"
import type { ComprobanteItem } from "../comprobantes/comprobanteTypes"
import CreateBoleta from "./CreateBoleta"
import IngresosFilters from "../controlInterno/IngresosFilters"

const BoletasMain = () => {
    const [formKey, setFormKey] = useState(0)
    const [openReporteModal, setOpenReporteModal] = useState(false)
    const [printingItem, setPrintingItem] = useState<ComprobanteItem | null>(null)
    const [anulandoItem, setAnulandoItem] = useState<ComprobanteItem | null>(null)
    const [page, setPage] = useState(1)
    const [fechaEmisionDesde, setFechaEmisionDesde] = useState("")
    const [fechaEmisionHasta, setFechaEmisionHasta] = useState("")
    const [personaDocumento, setPersonaDocumento] = useState("")
    const [personaNombres, setPersonaNombres] = useState("")
    const [usuario, setUsuario] = useState("")

    useEffect(() => {
        setPage(1)
    }, [
        fechaEmisionDesde,
        fechaEmisionHasta,
        personaDocumento,
        personaNombres,
        usuario,
    ])

    const handleClearFilters = () => {
        setFechaEmisionDesde("")
        setFechaEmisionHasta("")
        setPersonaDocumento("")
        setPersonaNombres("")
        setUsuario("")
        setPage(1)
    }

    const hasFilters =
        fechaEmisionDesde.trim() !== "" ||
        fechaEmisionHasta.trim() !== "" ||
        personaDocumento.trim() !== "" ||
        personaNombres.trim() !== "" ||
        usuario.trim() !== ""

    const handleCreateDone = () => {
        setFormKey((prev) => prev + 1)
    }

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <header className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-sky-100 pb-3">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-2">
                        <Receipt className="h-5 w-5 text-sky-600" aria-hidden />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-slate-800">Boletas</h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Consulte boletas de venta emitidas y gestione comprobantes
                            electrónicos.
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setOpenReporteModal(true)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
                >
                    <FileText className="h-3.5 w-3.5" aria-hidden />
                    Reporte
                </button>
            </header>

            <div className="rounded-lg border border-slate-100 bg-slate-50/40 p-4">
                <h3 className="mb-1 text-sm font-semibold text-slate-800">Nueva boleta</h3>
                <p className="mb-4 text-xs text-slate-500">
                    Complete los datos para emitir una boleta de venta.
                </p>
                <CreateBoleta key={formKey} onDone={handleCreateDone} />
            </div>

            <TopModal
                isOpen={openReporteModal}
                onClose={() => setOpenReporteModal(false)}
                wide
            >
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <header className="mb-4 shrink-0 border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-semibold text-slate-800">
                            Reporte de boletas
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                            Consulte y filtre las boletas emitidas.
                        </p>
                    </header>

                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <IngresosFilters
                            fecha_emision_desde={fechaEmisionDesde}
                            fecha_emision_hasta={fechaEmisionHasta}
                            persona_documento={personaDocumento}
                            persona_nombres={personaNombres}
                            usuario={usuario}
                            setFechaEmisionDesde={setFechaEmisionDesde}
                            setFechaEmisionHasta={setFechaEmisionHasta}
                            setPersonaDocumento={setPersonaDocumento}
                            setPersonaNombres={setPersonaNombres}
                            setUsuario={setUsuario}
                            onClear={handleClearFilters}
                        />

                        <ComprobantesList
                            variant="recibo"
                            comprobante={RECIBO_COMPROBANTE_BOLETA}
                            entityLabel="boleta"
                            entityLabelPlural="boletas"
                            page={page}
                            setPage={setPage}
                            fecha_emision_desde={fechaEmisionDesde}
                            fecha_emision_hasta={fechaEmisionHasta}
                            persona_documento={personaDocumento}
                            persona_nombres={personaNombres}
                            usuario={usuario}
                            hasFilters={hasFilters}
                            onImprimir={setPrintingItem}
                            onAnular={setAnulandoItem}
                        />
                    </div>
                </div>
            </TopModal>

            <ComprobantePdfModal
                variant="recibo"
                item={printingItem}
                onClose={() => setPrintingItem(null)}
            />

            <AnularComprobanteModal
                variant="recibo"
                item={anulandoItem}
                onClose={() => setAnulandoItem(null)}
            />
        </section>
    )
}

export default BoletasMain
