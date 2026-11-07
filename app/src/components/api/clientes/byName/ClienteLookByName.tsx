import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2, Search } from "lucide-react"
import useAuthStore from "../../../../store/useAuthStore"
import useGetClienteByNameOrRazon from "../../../../hooks/api/cliente/useGetClienteByNameOrRazon"
import ClienteByNameTable from "./ClienteByNameTable"
import { Cliente } from "../../../../services/api/cliente1Service"

interface Props {
    setShowContratanteForm: React.Dispatch<React.SetStateAction<boolean>>
    setSelectedTipoPersona: React.Dispatch<React.SetStateAction<number>>
    setCliente1: React.Dispatch<React.SetStateAction<Cliente | null>>
}

const ClienteLookByName = ({
    setShowContratanteForm,
    setSelectedTipoPersona,
    setCliente1,
}: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const [nameOrRazon, setNameOrRazon] = useState("")
    const [page, setPage] = useState(1)
    const { data: clientePage, refetch } = useGetClienteByNameOrRazon({ access, nameOrRazon, page })
    const [loading, setLoading] = useState(false)
    const [showTable, setShowTable] = useState(true)
    const canSearch = nameOrRazon.trim().length > 0 && !loading

    const handleSearch = () => {
        setLoading(true)
        setShowTable(true)
        setShowContratanteForm(false)
        refetch().finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-500" htmlFor="preclient-name">
                        Nombre / razón social
                    </label>
                    <input
                        id="preclient-name"
                        type="text"
                        value={nameOrRazon}
                        onChange={(e) => setNameOrRazon(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault()
                                if (canSearch) handleSearch()
                            }
                        }}
                        placeholder="Ingrese el nombre, apellidos o razón social"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                        autoComplete="off"
                    />
                </div>
                <motion.button
                    type="button"
                    onClick={handleSearch}
                    disabled={!canSearch}
                    whileHover={canSearch ? { y: -1 } : undefined}
                    whileTap={canSearch ? { scale: 0.98 } : undefined}
                    className="inline-flex h-[42px] shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                        <Search className="h-4 w-4" aria-hidden />
                    )}
                    {loading ? "Buscando" : "Buscar"}
                </motion.button>
            </div>

            <AnimatePresence initial={false}>
                {clientePage && showTable && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.24, ease: "easeOut" }}
                    >
                        <ClienteByNameTable
                            clientes={clientePage.results}
                            count={clientePage.count}
                            page={page}
                            setPage={setPage}
                            refetch={refetch}
                            setShowContratanteForm={setShowContratanteForm}
                            setCliente1={setCliente1}
                            setSelectedTipoPersona={setSelectedTipoPersona}
                            setShowTable={setShowTable}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ClienteLookByName
