import { useEffect, useState } from "react"
import { FileText } from "lucide-react"
import {
    RECIBO_COMPROBANTE_NOTA_CREDITO,
    RECIBO_COMPROBANTE_NOTA_DEBITO,
} from "../../../services/taxes/recibosService"
import TopModal from "../../ui/TopModal"
import IngresosFilters, {
    type KardexPresenceFilter,
} from "../controlInterno/IngresosFilters"
import AnularComprobanteModal from "../comprobantes/AnularComprobanteModal"
import ComprobantePdfModal from "../comprobantes/ComprobantePdfModal"
import ComprobantesList from "../comprobantes/ComprobantesList"
import RecibosModificablesList from "../comprobantes/RecibosModificablesList"
import type { ComprobanteItem } from "../comprobantes/comprobanteTypes"

type NotasTab = "credito" | "debito"

const TAB_CONFIG = {
    credito: {
        label: "Crédito",
        comprobante: RECIBO_COMPROBANTE_NOTA_CREDITO,
        entityLabel: "nota de crédito",
        entityLabelPlural: "notas de crédito",
        reporteTitle: "Reporte de notas de crédito",
        reporteDescription: "Consulte y filtre las notas de crédito emitidas.",
    },
    debito: {
        label: "Débito",
        comprobante: RECIBO_COMPROBANTE_NOTA_DEBITO,
        entityLabel: "nota de débito",
        entityLabelPlural: "notas de débito",
        reporteTitle: "Reporte de notas de débito",
        reporteDescription: "Consulte y filtre las notas de débito emitidas.",
    },
} as const

const NotasMain = () => {
    const [tab, setTab] = useState<NotasTab>("credito")
    const [openReporteModal, setOpenReporteModal] = useState(false)
    const [printingItem, setPrintingItem] = useState<ComprobanteItem | null>(null)
    const [anulandoItem, setAnulandoItem] = useState<ComprobanteItem | null>(null)
    const [page, setPage] = useState(1)
    const [fechaEmisionDesde, setFechaEmisionDesde] = useState("")
    const [fechaEmisionHasta, setFechaEmisionHasta] = useState("")
    const [personaDocumento, setPersonaDocumento] = useState("")
    const [personaNombres, setPersonaNombres] = useState("")
    const [kardex, setKardex] = useState("")
    const [hasKardex, setHasKardex] = useState<KardexPresenceFilter>("")
    const [usuario, setUsuario] = useState("")

    const active = TAB_CONFIG[tab]

    useEffect(() => {
        setPage(1)
    }, [
        fechaEmisionDesde,
        fechaEmisionHasta,
        personaDocumento,
        personaNombres,
        kardex,
        hasKardex,
        usuario,
        tab,
    ])

    const handleClearFilters = () => {
        setFechaEmisionDesde("")
        setFechaEmisionHasta("")
        setPersonaDocumento("")
        setPersonaNombres("")
        setKardex("")
        setHasKardex("")
        setUsuario("")
        setPage(1)
    }

    const hasFilters =
        fechaEmisionDesde.trim() !== "" ||
        fechaEmisionHasta.trim() !== "" ||
        personaDocumento.trim() !== "" ||
        personaNombres.trim() !== "" ||
        kardex.trim() !== "" ||
        hasKardex.trim() !== "" ||
        usuario.trim() !== ""

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <header className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-sky-100 pb-3">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-2">
                        <FileText className="h-5 w-5 text-sky-600" aria-hidden />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-slate-800">Notas</h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Emita notas de crédito o débito desde un comprobante
                            modificable y consulte los reportes emitidos.
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

            <div className="mb-4 flex flex-wrap gap-2 border-b border-slate-100 pb-3">
                {(Object.keys(TAB_CONFIG) as NotasTab[]).map((key) => {
                    const item = TAB_CONFIG[key]
                    const activeTab = tab === key
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setTab(key)}
                            className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                activeTab
                                    ? key === "credito"
                                        ? "bg-rose-600 text-white shadow-sm"
                                        : "bg-teal-600 text-white shadow-sm"
                                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                            Nota de {item.label.toLowerCase()}
                        </button>
                    )
                })}
            </div>

            <RecibosModificablesList
                title={
                    tab === "credito"
                        ? "Comprobantes para nota de crédito"
                        : "Comprobantes para nota de débito"
                }
                description="Elija un comprobante y emita la nota con los datos precargados."
                preferredVariant={tab === "credito" ? "nota_credito" : "nota_debito"}
            />

            <TopModal
                isOpen={openReporteModal}
                onClose={() => setOpenReporteModal(false)}
                wide
            >
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <header className="mb-4 shrink-0 border-b border-slate-100 pb-3">
                        <div className="mb-3 flex flex-wrap gap-2">
                            {(Object.keys(TAB_CONFIG) as NotasTab[]).map((key) => {
                                const item = TAB_CONFIG[key]
                                const activeTab = tab === key
                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onClick={() => setTab(key)}
                                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                            activeTab
                                                ? "bg-sky-600 text-white"
                                                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                        }`}
                                    >
                                        Nota de {item.label.toLowerCase()}
                                    </button>
                                )
                            })}
                        </div>
                        <h3 className="text-sm font-semibold text-slate-800">
                            {active.reporteTitle}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                            {active.reporteDescription}
                        </p>
                    </header>

                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <IngresosFilters
                            fecha_emision_desde={fechaEmisionDesde}
                            fecha_emision_hasta={fechaEmisionHasta}
                            persona_documento={personaDocumento}
                            persona_nombres={personaNombres}
                            kardex={kardex}
                            has_kardex={hasKardex}
                            usuario={usuario}
                            setFechaEmisionDesde={setFechaEmisionDesde}
                            setFechaEmisionHasta={setFechaEmisionHasta}
                            setPersonaDocumento={setPersonaDocumento}
                            setPersonaNombres={setPersonaNombres}
                            setKardex={setKardex}
                            setHasKardex={setHasKardex}
                            setUsuario={setUsuario}
                            onClear={handleClearFilters}
                        />

                        <ComprobantesList
                            key={tab}
                            variant="recibo"
                            comprobante={active.comprobante}
                            entityLabel={active.entityLabel}
                            entityLabelPlural={active.entityLabelPlural}
                            page={page}
                            setPage={setPage}
                            fecha_emision_desde={fechaEmisionDesde}
                            fecha_emision_hasta={fechaEmisionHasta}
                            persona_documento={personaDocumento}
                            persona_nombres={personaNombres}
                            kardex={kardex}
                            has_kardex={hasKardex}
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
                reciboComprobanteId={active.comprobante}
                entityLabel={active.entityLabel}
                onClose={() => setAnulandoItem(null)}
            />
        </section>
    )
}

export default NotasMain
