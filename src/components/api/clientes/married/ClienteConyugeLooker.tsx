import useGetClienteByDni from "../../../../hooks/api/cliente/useGetClienteByDni"
import useAuthStore from "../../../../store/useAuthStore"

type Props = {
    document: string
    setDocument: (document: string) => void
}

const ClienteConyugeLooker = ({ document, setDocument }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { data: cliente, isLoading, isError, error, isSuccess} = useGetClienteByDni({ access, dni: document })
    return (
        <>
        <div className="w-full grid grid-cols-4 gap-4 mx-auto px-2">
            <input 
                type="text" 
                placeholder="Ingrese Documento" 
                value={document} 
                onChange={(e) => setDocument(e.target.value)} 
                className="w-full border border-gray-300 rounded-md py-1 px-4 col-span-3"
            />
            <button
                type="button"
                className="w-20 border bg-blue-600 text-white text-sm rounded-md py-1 px-4 cursor-pointer hover:bg-blue-500 transition-all duration-300"
            >
                <p>Buscar</p>
            </button>
        </div>
        {
            isLoading && <p className="text-center text-xs text-gray-500 animate-pulse my-2">Cargando...</p>
        }
        {
            isError && <p className="text-center text-xs text-red-500 my-2">Error: {error.message}</p>
        }
        {
            isSuccess && <p className="text-center text-xs text-green-500 my-2">Cliente encontrado: {cliente?.nombre}</p>
        }
        </>
    )
}

export default ClienteConyugeLooker