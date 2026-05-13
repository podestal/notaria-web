import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import TopModal from "../../ui/TopModal"
import ActoCondicionFilters from "./ActoCondicionFilters"
import ActoCondicionList from "./ActoCondicionList"
import CreateActo from "./CreateActo"

const ActoCondicionMain = () => {
    const [desacto, setDesacto] = useState("")
    const [idtipoacto, setIdtipoacto] = useState("")
    const [idtipkar, setIdtipkar] = useState("")
    const [page, setPage] = useState(1)
    const [createOpen, setCreateOpen] = useState(false)

    useEffect(() => {
        setPage(1)
    }, [desacto, idtipoacto, idtipkar])

    const limpiar = () => {
        setDesacto("")
        setIdtipoacto("")
        setIdtipkar("")
        setPage(1)
    }

    return (
        <>
            <div className="mx-auto max-w-6xl px-4 py-6">
                <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Acto / condición</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Consulte tipos de acto filtrando por descripción, código de tipo de acto o tipo de kardex.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setCreateOpen(true)}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" aria-hidden />
                        Nuevo acto
                    </button>
                </header>

                <ActoCondicionFilters
                    desacto={desacto}
                    setDesacto={setDesacto}
                    idtipoacto={idtipoacto}
                    setIdtipoacto={setIdtipoacto}
                    idtipkar={idtipkar}
                    setIdtipkar={setIdtipkar}
                    onLimpiar={limpiar}
                />

                <ActoCondicionList
                    desacto={desacto}
                    idtipoacto={idtipoacto}
                    idtipkar={idtipkar}
                    page={page}
                    setPage={setPage}
                />
            </div>

            <TopModal isOpen={createOpen} onClose={() => setCreateOpen(false)}>
                <CreateActo />
            </TopModal>
        </>
    )
}

export default ActoCondicionMain
