import { useEffect, useState } from "react"
import { ClipboardList, FileText } from "lucide-react"
import type { Ingreso } from "../../../services/taxes/ingresosService"
import TopModal from "../../ui/TopModal"
import AnularComprobanteModal from "../comprobantes/AnularComprobanteModal"
import ComprobantePdfModal from "../comprobantes/ComprobantePdfModal"
import CanjearIngresoModal from "./CanjearIngresoModal"
import CreateIngreso from "./CreateIngreso"
import IngresosFilters from "./IngresosFilters"
import IngresosList from "./IngresosList"
import UpdateIngreso from "./UpdateIngreso"

const ControlInternoMain = () => {
    const [formKey, setFormKey] = useState(0)
    const [openReporteModal, setOpenReporteModal] = useState(false)
    const [editingIngreso, setEditingIngreso] = useState<Ingreso | null>(null)
    const [anulandoIngreso, setAnulandoIngreso] = useState<Ingreso | null>(null)
    const [printingIngreso, setPrintingIngreso] = useState<Ingreso | null>(null)
    const [canjeandoIngreso, setCanjeandoIngreso] = useState<Ingreso | null>(null)
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

    const handleEditFromReporte = (ingreso: Ingreso) => {
        setEditingIngreso(ingreso)
    }

    const handleAnularFromReporte = (ingreso: Ingreso) => {
        setAnulandoIngreso(ingreso)
    }

    const handleImprimirFromReporte = (ingreso: Ingreso) => {
        setPrintingIngreso(ingreso)
    }

    const handleCanjearFromReporte = (ingreso: Ingreso) => {
        setCanjeandoIngreso(ingreso)
    }

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <header className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-sky-100 pb-3">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-2">
                        <ClipboardList className="h-5 w-5 text-sky-600" aria-hidden />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-slate-800">Control interno</h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Registre ingresos y consulte el reporte de comprobantes emitidos.
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
                <h3 className="mb-1 text-sm font-semibold text-slate-800">Nuevo ingreso</h3>
                <p className="mb-4 text-xs text-slate-500">
                    Complete los datos para registrar un comprobante de control interno.
                </p>
                <CreateIngreso key={formKey} onDone={handleCreateDone} />
            </div>

            <TopModal
                isOpen={openReporteModal}
                onClose={() => setOpenReporteModal(false)}
                wide
            >
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <header className="mb-4 shrink-0 border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-semibold text-slate-800">
                            Reporte de ingresos
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                            Consulte y filtre los ingresos registrados.
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

                        <IngresosList
                            page={page}
                            setPage={setPage}
                            fecha_emision_desde={fechaEmisionDesde}
                            fecha_emision_hasta={fechaEmisionHasta}
                            persona_documento={personaDocumento}
                            persona_nombres={personaNombres}
                            usuario={usuario}
                            hasFilters={hasFilters}
                            onEdit={handleEditFromReporte}
                            onImprimir={handleImprimirFromReporte}
                            onAnular={handleAnularFromReporte}
                            onCanjear={handleCanjearFromReporte}
                        />
                    </div>
                </div>
            </TopModal>

            <TopModal
                isOpen={Boolean(editingIngreso)}
                onClose={() => setEditingIngreso(null)}
                deepth={50}
                portal
            >
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800">Editar ingreso</h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Modifique los datos del ingreso seleccionado.
                    </p>
                    <div className="mt-4">
                        {editingIngreso && (
                            <UpdateIngreso
                                ingreso={editingIngreso}
                                onCancel={() => setEditingIngreso(null)}
                            />
                        )}
                    </div>
                </div>
            </TopModal>

            <AnularComprobanteModal
                variant="ingreso"
                item={anulandoIngreso}
                onClose={() => setAnulandoIngreso(null)}
            />

            <ComprobantePdfModal
                variant="ingreso"
                item={printingIngreso}
                onClose={() => setPrintingIngreso(null)}
            />

            <CanjearIngresoModal
                ingreso={canjeandoIngreso}
                onClose={() => setCanjeandoIngreso(null)}
            />
        </section>
    )
}

export default ControlInternoMain
