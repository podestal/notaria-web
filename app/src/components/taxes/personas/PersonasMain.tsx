import { useEffect, useState } from "react"
import { Users } from "lucide-react"
import type { Persona } from "../../../services/taxes/personasService"
import TopModal from "../../ui/TopModal"
import CreatePersona from "./CreatePersona"
import PersonasFilters from "./PersonasFilters"
import PersonasList from "./PersonasList"
import UpdatePersona from "./UpdatePersona"

const PersonasMain = () => {
    const [page, setPage] = useState(1)
    const [nombres, setNombres] = useState("")
    const [apellidoPaterno, setApellidoPaterno] = useState("")
    const [apellidoMaterno, setApellidoMaterno] = useState("")
    const [razonSocial, setRazonSocial] = useState("")
    const [numeroDocumento, setNumeroDocumento] = useState("")
    const [documento, setDocumento] = useState("")
    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [editingPersona, setEditingPersona] = useState<Persona | null>(null)

    useEffect(() => {
        setPage(1)
    }, [nombres, apellidoPaterno, apellidoMaterno, razonSocial, numeroDocumento, documento])

    const handleClearFilters = () => {
        setNombres("")
        setApellidoPaterno("")
        setApellidoMaterno("")
        setRazonSocial("")
        setNumeroDocumento("")
        setDocumento("")
        setPage(1)
    }

    const hasFilters =
        nombres.trim() !== "" ||
        apellidoPaterno.trim() !== "" ||
        apellidoMaterno.trim() !== "" ||
        razonSocial.trim() !== "" ||
        numeroDocumento.trim() !== "" ||
        documento.trim() !== ""

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <header className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-sky-100 pb-3">
                <div className="flex items-start gap-3">
                    <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-2">
                        <Users className="h-5 w-5 text-sky-600" aria-hidden />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-slate-800">Personas</h2>
                        <p className="mt-1 text-xs text-slate-500">
                            Clientes y contactos registrados para facturación.
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => setOpenCreateModal(true)}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                    Nueva persona
                </button>
            </header>

            <PersonasFilters
                nombres={nombres}
                apellido_paterno={apellidoPaterno}
                apellido_materno={apellidoMaterno}
                razon_social={razonSocial}
                numero_documento={numeroDocumento}
                documento={documento}
                setNombres={setNombres}
                setApellidoPaterno={setApellidoPaterno}
                setApellidoMaterno={setApellidoMaterno}
                setRazonSocial={setRazonSocial}
                setNumeroDocumento={setNumeroDocumento}
                setDocumento={setDocumento}
                onClear={handleClearFilters}
            />

            <PersonasList
                page={page}
                setPage={setPage}
                nombres={nombres}
                apellido_paterno={apellidoPaterno}
                apellido_materno={apellidoMaterno}
                razon_social={razonSocial}
                numero_documento={numeroDocumento}
                documento={documento}
                hasFilters={hasFilters}
                onEdit={setEditingPersona}
            />

            <TopModal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)}>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800">Nueva persona</h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Complete los datos para registrar una persona.
                    </p>
                    <div className="mt-4">
                        <CreatePersona onDone={() => setOpenCreateModal(false)} />
                    </div>
                </div>
            </TopModal>

            <TopModal isOpen={Boolean(editingPersona)} onClose={() => setEditingPersona(null)}>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800">Editar persona</h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Modifique los datos de la persona seleccionada.
                    </p>
                    <div className="mt-4">
                        {editingPersona && (
                            <UpdatePersona
                                persona={editingPersona}
                                onCancel={() => setEditingPersona(null)}
                            />
                        )}
                    </div>
                </div>
            </TopModal>
        </section>
    )
}

export default PersonasMain
