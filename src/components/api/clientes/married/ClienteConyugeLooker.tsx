import axios from "axios"
import useAuthStore from "../../../../store/useAuthStore"
import { useState } from "react"
import { Loader } from "lucide-react"
import { Cliente } from "../../../../services/api/cliente1Service"
import getTitleCase from "../../../../utils/getTitleCase"
import useUpdateCliente from "../../../../hooks/api/cliente/useUpdateCliente"

interface Props {
    setConyuge: React.Dispatch<React.SetStateAction<string>>
    setConyugeName: React.Dispatch<React.SetStateAction<string>>
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
    cliente1: Cliente
    civilStatus: number
}

const ClienteConyugeLooker = ({ setConyuge, setConyugeName, setIsOpen, cliente1, civilStatus }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const [document, setDocument] = useState('')
    const [loading, setLoading] = useState(false)
    const [client, setClient] = useState<Cliente | null>(null)

    const updateCliente = useUpdateCliente({ dni: cliente1.numdoc, clienteId: cliente1.idcliente })

    const handleLookup = () => {
        setLoading(true)
        axios.get(
            `${import.meta.env.VITE_API_URL}cliente/by_dni/?dni=${document}`,
            {
                headers: {
                    'Authorization': `JWT ${access}`
                }
            }
        ).then(response => {
            if (response.data.idcliente) {
                console.log('Cliente encontrado:', response.data);
                setClient(response.data)
                // setCliente1(response.data)
                // setShowContratanteForm(true)
                // setShowClienteForm(false)
            } else {
                console.log('Cliente no encontrado, creando nuevo cliente')
                // setCliente1(null)
                // setShowContratanteForm(false)
                // setShowClienteForm(true)
            }
        }).catch(error => {
            console.log('Error al buscar el cliente:', error);
            console.error(error);
        }).finally(() => {
            setLoading(false)
        })
    }

    const handleSelect = () => {
        updateCliente.mutate({
            access,
            cliente: {
                ...cliente1,
                conyuge: client?.idcliente,
                idestcivil: civilStatus,
                // conyuge_name: client?.nombre
            }
        }, {
            onSuccess: () => {
                setConyuge(client?.idcliente || '')
                setConyugeName(client?.nombre || '')
                setIsOpen(false)
            },
            onError: (error) => {
                console.log('Error al actualizar el cliente:', error)
            }
        })

    }

    return (
        <>
        <p className=" text-center mb-4 font-bold text-xl">Buscar Conyuge</p>
        <div className="w-full grid grid-cols-4 gap-4 mx-auto px-2 py-4">
            <input 
                type="text" 
                placeholder="Ingrese Documento" 
                value={document} 
                onChange={(e) => setDocument(e.target.value)} 
                className="w-full border border-gray-300 rounded-md py-1 px-4 col-span-3"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleLookup();
                    }
                }}  
            />
            <button
                type="button"
                onClick={handleLookup}
                className="w-20 border flex items-center justify-center bg-blue-600 text-white text-sm rounded-md py-1 px-4 cursor-pointer hover:bg-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
            >
                {loading ? <Loader className="w-4 h-4 animate-spin text-center" /> : <p>Buscar</p>}
            </button>
        </div>
        {client &&
        <div className="w-full flex items-center justify-center gap-8 mt-8">
            <p className="text-sm text-center">{getTitleCase(client.nombre || '')}</p>
            <button
                type="button"
                onClick={handleSelect}
                className="w-30 border flex items-center justify-center bg-green-600 text-white text-sm rounded-md py-1 px-4 cursor-pointer hover:bg-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <p>Seleccionar</p>
            </button>
        </div>
        }
        </>
    )
}

export default ClienteConyugeLooker