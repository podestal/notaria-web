import { useEffect, useState } from "react"
import type { Catalog } from "../../../services/taxes/catalogService"
import TopModal from "../../ui/TopModal"
import CatalogoFilters from "./CatalogoFilters"
import CatalogoList from "./CatalogoList"
import CreateCatalogo from "./CreateCatalogo"
import UpdateCatalogo from "./UpdateCatalogo"

const CatalogoMain = () => {
    const [page, setPage] = useState(1)
    const [codigo, setCodigo] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [openCreateModal, setOpenCreateModal] = useState(false)
    const [editingCatalog, setEditingCatalog] = useState<Catalog | null>(null)

    useEffect(() => {
        setPage(1)
    }, [codigo, descripcion])

    const handleClearFilters = () => {
        setCodigo("")
        setDescripcion("")
        setPage(1)
    }

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <header className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-base font-semibold text-slate-800">Catálogo</h2>
                    <p className="mt-1 text-xs text-slate-500">
                        Productos y servicios disponibles para facturación.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setOpenCreateModal(true)}
                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                    Nuevo ítem
                </button>
            </header>

            <CatalogoFilters
                codigo={codigo}
                descripcion={descripcion}
                setCodigo={setCodigo}
                setDescripcion={setDescripcion}
                onClear={handleClearFilters}
            />

            <CatalogoList
                page={page}
                setPage={setPage}
                codigo={codigo}
                descripcion={descripcion}
                onEdit={setEditingCatalog}
            />

            <TopModal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)}>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800">Nuevo ítem de catálogo</h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Complete los campos para registrar un producto o servicio.
                    </p>
                    <div className="mt-4">
                        <CreateCatalogo onDone={() => setOpenCreateModal(false)} />
                    </div>
                </div>
            </TopModal>

            <TopModal isOpen={Boolean(editingCatalog)} onClose={() => setEditingCatalog(null)}>
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800">Editar ítem de catálogo</h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Modifique los datos del ítem seleccionado.
                    </p>
                    <div className="mt-4">
                        {editingCatalog && (
                            <UpdateCatalogo
                                catalog={editingCatalog}
                                onCancel={() => setEditingCatalog(null)}
                            />
                        )}
                    </div>
                </div>
            </TopModal>
        </section>
    )
}

export default CatalogoMain
