import { useEffect, useState, type LucideIcon, type ReactNode } from "react"
import { FileText } from "lucide-react"
import TopModal from "../../ui/TopModal"
import IngresosFilters from "../controlInterno/IngresosFilters"
import AnularComprobanteModal from "./AnularComprobanteModal"
import ComprobantePdfModal from "./ComprobantePdfModal"
import type { ComprobanteItem, ComprobanteVariant } from "./comprobanteTypes"

export interface ComprobanteReporteContext {
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    fecha_emision_desde: string
    fecha_emision_hasta: string
    persona_documento: string
    persona_nombres: string
    usuario: string
    hasFilters: boolean
    onImprimir: (item: ComprobanteItem) => void
    onAnular: (item: ComprobanteItem) => void
}

interface Props {
    icon: LucideIcon
    title: string
    description: string
    createTitle: string
    createDescription: string
    createForm: (onDone: () => void) => ReactNode
    reporteTitle: string
    reporteDescription: string
    listVariant: ComprobanteVariant
    renderReporteList: (context: ComprobanteReporteContext) => ReactNode
    children?: ReactNode
}

const ComprobanteSectionMain = ({
    icon: Icon,
    title,
    description,
    createTitle,
    createDescription,
    createForm,
    reporteTitle,
    reporteDescription,
    listVariant,
    renderReporteList,
    children,
}: Props) => {
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
                        <Icon className="h-5 w-5 text-sky-600" aria-hidden />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
                        <p className="mt-1 text-xs text-slate-500">{description}</p>
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
                <h3 className="mb-1 text-sm font-semibold text-slate-800">{createTitle}</h3>
                <p className="mb-4 text-xs text-slate-500">{createDescription}</p>
                <div key={formKey}>{createForm(handleCreateDone)}</div>
            </div>

            <TopModal
                isOpen={openReporteModal}
                onClose={() => setOpenReporteModal(false)}
                wide
            >
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <header className="mb-4 shrink-0 border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-semibold text-slate-800">{reporteTitle}</h3>
                        <p className="mt-1 text-xs text-slate-500">{reporteDescription}</p>
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

                        {renderReporteList({
                            page,
                            setPage,
                            fecha_emision_desde: fechaEmisionDesde,
                            fecha_emision_hasta: fechaEmisionHasta,
                            persona_documento: personaDocumento,
                            persona_nombres: personaNombres,
                            usuario,
                            hasFilters,
                            onImprimir: setPrintingItem,
                            onAnular: setAnulandoItem,
                        })}
                    </div>
                </div>
            </TopModal>

            <ComprobantePdfModal
                variant={listVariant}
                item={printingItem}
                onClose={() => setPrintingItem(null)}
            />

            <AnularComprobanteModal
                variant={listVariant}
                item={anulandoItem}
                onClose={() => setAnulandoItem(null)}
            />

            {children}
        </section>
    )
}

export default ComprobanteSectionMain
