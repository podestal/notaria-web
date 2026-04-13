import { useState } from "react"
import Selector from "../../../../ui/Selector"
import useNotificationsStore from "../../../../../hooks/store/useNotificationsStore"
import axios from "axios"
import useAuthStore from "../../../../../store/useAuthStore"

interface Props {
    selectedTipoPersona: number
    setSelectedTipoPersona: React.Dispatch<React.SetStateAction<number>>
    document: string
    setDocument:  React.Dispatch<React.SetStateAction<string>>
    setApellidoPaterno: React.Dispatch<React.SetStateAction<string>>
    setApellidoMaterno: React.Dispatch<React.SetStateAction<string>>
    setPrimerNombre: React.Dispatch<React.SetStateAction<string>>
    setSegundoNombre: React.Dispatch<React.SetStateAction<string>>
    setDireccion: React.Dispatch<React.SetStateAction<string>>
    setRazonSocial: React.Dispatch<React.SetStateAction<string>>
    setDomicilioFiscal: React.Dispatch<React.SetStateAction<string>>
    setCodeCliente: React.Dispatch<React.SetStateAction<string>>
    setUbigeo: React.Dispatch<React.SetStateAction<string>>
    setOpenCreateCliente: React.Dispatch<React.SetStateAction<boolean>>
}

const PreClienteForm = ({ 
    selectedTipoPersona, 
    setSelectedTipoPersona, 
    document, 
    setDocument, 
    setApellidoPaterno, 
    setApellidoMaterno, 
    setPrimerNombre, 
    setSegundoNombre, 
    setDireccion, 
    setRazonSocial, 
    setDomicilioFiscal, 
    setCodeCliente,
    setUbigeo,
    setOpenCreateCliente
 }: Props) => {

    const access = useAuthStore(state => state.access_token) || ''
    const { setMessage, setType, setShow } = useNotificationsStore()
    const [loading, setLoading] = useState(false)

    const handleSearch = () => {
        
        
        if (selectedTipoPersona === 0) {
            setMessage('Seleccione un tipo de persona')
            setType('error')
            setShow(true)
            return
        }

        if (selectedTipoPersona === 1 && document.length !== 8) {
            setMessage('Ingrese un documento válido')
            setType('error')
            setShow(true)
            return
        }

        if (selectedTipoPersona === 2 && document.length !== 11) {
            setMessage('Ingrese un documento válido')
            setType('error')
            setShow(true)
            return
        }

        setLoading(true);

        if (selectedTipoPersona === 1) {
            axios.get(
                `${import.meta.env.VITE_API_URL}cliente/by_dni/?dni=${document}`,
                {
                    headers: {
                        'Authorization': `JWT ${access}`
                    }
                }
            ).then(response => {
                if (response.data.idcliente) {
                    setApellidoPaterno(response.data.apepat);
                    setApellidoMaterno(response.data.apemat);
                    setPrimerNombre(response.data.prinom);
                    setSegundoNombre(response.data.segnom);
                    setDireccion(response.data.direccion);
                    setCodeCliente(response.data.idcliente);
                    setUbigeo(response.data.idubigeo);
                } else {
                    console.log('Cliente no encontrado, creando nuevo cliente')
                    setOpenCreateCliente(true)
                }
            }).catch(error => {
                console.log('Error al buscar el cliente:', error);
                console.error(error);
            }).finally(() => {
                setLoading(false)
            })
        } else if (selectedTipoPersona === 2) {
            axios.get(
                `${import.meta.env.VITE_API_URL}cliente/by_ruc/?ruc=${document}`,{
                    headers: {
                        'Authorization': `JWT ${access}`
                    }
                }
            ).then(response => {
                console.log(response.data);
                if (response.data.idcliente) {
                    setRazonSocial(response.data.razonsocial);
                    setDomicilioFiscal(response.data.domfiscal);
                    setCodeCliente(response.data.idcliente);
                } else {
                    console.log('Cliente no encontrado, creando nuevo cliente')
                    setOpenCreateCliente(true)
                }
            }).catch(error => {
                console.log('Error al buscar el cliente:', error);
                console.error(error);
            }).finally(() => {
                setLoading(false)
            })
        }


        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }

  return (
    <div className="grid grid-cols-5 items-center gap-6 text-black">
        <>{console.log(selectedTipoPersona)}</>
        <Selector 
            label="Tipo de Persona"
            options={[
                { value: 0, label: 'Seleccione una opción' },
                { value: 1, label: 'Persona Natural' },
                { value: 2, label: 'Persona Jurídica' }
            ]}
            setter={setSelectedTipoPersona}
            defaultValue={selectedTipoPersona}
            
        />
        
        <div className="flex flex-col gap-2 col-span-2">
            <p className="text-md font-bold py-2">Documento</p>
            <input 
                type="text"
                value={document}
                onChange={e => setDocument(e.target.value)}
                placeholder='Document'
                className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
            />
        </div>
        <button 
            disabled={loading}
            className={`w-[60%] mx-auto bg-blue-600 text-white rounded-md py-2 mt-4 transition-colors duration-300 ${loading && 'animate-pulse'} ${document.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer hover:bg-blue-500'}`} 
            type="button"
            onClick={handleSearch}
        >
            {loading ? '...' : 'Buscar'}
        </button>
    </div>
  )
}

export default PreClienteForm