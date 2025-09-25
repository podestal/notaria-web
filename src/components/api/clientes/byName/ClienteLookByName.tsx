import { useState } from "react"
import useAuthStore from "../../../../store/useAuthStore"
import useGetClienteByNameOrRazon from "../../../../hooks/api/cliente/useGetClienteByNameOrRazon"


const ClienteLookByName = () => {
    const access = useAuthStore(s => s.access_token) || ''
    const [nameOrRazon, setNameOrRazon] = useState('')
    const { data: clientePage, refetch } = useGetClienteByNameOrRazon({ access, nameOrRazon })
    const [loading, setLoading] = useState(false)

    const handleSearch = () => {
        setLoading(true)
        refetch().finally(() => {
            setLoading(false)
        })
    }

    return (
        <div className="col-span-5 text-center text-sm flex items-center justify-center gap-2">
            <input
                type="text"
                value={nameOrRazon}
                onChange={e => setNameOrRazon(e.target.value)}
                placeholder="Ingrese el Nombre, Apellidos / Razon Social"
                className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
            />
            <button
                className={`w-40 mx-auto bg-blue-600 text-white rounded-md py-2 transition-colors duration-300 ${loading && 'animate-pulse'} ${document.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer hover:bg-blue-500'}`} 
                type="button"
                onClick={handleSearch}
                >
                {loading ? '...' : 'Buscar'}
                
            </button>
            <>{console.log('clientes', clientePage)}</>
        </div>
    )
}

export default ClienteLookByName