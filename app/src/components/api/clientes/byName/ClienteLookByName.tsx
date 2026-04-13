import { useState } from "react"
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
    setCliente1
}: Props) => {
    const access = useAuthStore(s => s.access_token) || ''
    const [nameOrRazon, setNameOrRazon] = useState('')
    const [page, setPage] = useState(1)
    const { data: clientePage, refetch } = useGetClienteByNameOrRazon({ access, nameOrRazon, page })
    const [loading, setLoading] = useState(false)

    const [showTable, setShowTable] = useState(true)

    const handleSearch = () => {
        setLoading(true)
        setShowTable(true)
        setShowContratanteForm(false)
        refetch().finally(() => {
            setLoading(false)
        })
    }

    return (
        <>
         <div className="col-span-5 text-center text-sm flex items-center justify-center gap-2">
            <input
                type="text"
                value={nameOrRazon}
                onChange={e => setNameOrRazon(e.target.value)}
                placeholder="Ingrese el Nombre, Apellidos / Razon Social"
                className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
            />
            <button
                className={`w-40 mx-auto bg-blue-600 text-white rounded-md py-2 transition-colors duration-300 ${loading && 'animate-pulse'} ${nameOrRazon.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer hover:bg-blue-500'}`} 
                type="button"
                onClick={handleSearch}
                disabled={nameOrRazon.length === 0}
                >
                {loading ? '...' : 'Buscar'}
                
            </button>
        </div>
        {clientePage && showTable &&
        <div className="col-span-5">
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
        </div>
        }
        </>
       
    )
}

export default ClienteLookByName