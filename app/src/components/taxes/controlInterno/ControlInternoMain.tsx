import { useEffect, useState } from "react"
import { ClipboardList } from "lucide-react"
import type { Ingreso } from "../../../services/taxes/ingresosService"
import TopModal from "../../ui/TopModal"
import CreateIngreso from "./CreateIngreso"
import IngresosFilters from "./IngresosFilters"
import IngresosList from "./IngresosList"
import UpdateIngreso from "./UpdateIngreso"

const ControlInternoMain = () => {
    const [page, setPage] = useState(1)
    const [fechaEmisionDesde, setFechaEmisionDesde] = useState("")
    const [fechaEmisionHasta, setFechaEmisionHasta] = useState("")
    const [personaDocumento, setPersonaDocumento] = useState("")
    const [personaNombres, setPersonaNombres] = useState("")
    const [usuario, setUsuario] = useState("")
    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [editingIngreso, setEditingIngreso] = useState<Ingreso | null>(null)

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
                            Ingresos y comprobantes registrados en facturación.
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setOpenCreateModal(true)}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                    Nuevo ingreso
                </button>
            </header>

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
                onEdit={setEditingIngreso}
            />

            <TopModal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)}>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800">Nuevo ingreso</h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Complete los datos para registrar un ingreso.
                    </p>
                    <div className="mt-4">
                        <CreateIngreso onDone={() => setOpenCreateModal(false)} />
                    </div>
                </div>
            </TopModal>

            <TopModal isOpen={Boolean(editingIngreso)} onClose={() => setEditingIngreso(null)}>
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
        </section>
    )
}

export default ControlInternoMain
