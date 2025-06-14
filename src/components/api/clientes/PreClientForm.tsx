import { useState } from "react"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import Selector from "../../ui/Selector"
import axios from "axios"
import { Cliente } from "../../../services/api/cliente1Service"
import CreateCliente from "./CreateCliente"
import UpdateCliente from "./UpdateCliente"
import CreateContratante from "../contratantes/CreateContratante"

interface Props {
    idtipoacto: string
    idtipkar: number
    kardex: string
    setClientesCheck: React.Dispatch<React.SetStateAction<boolean>>
}

const documentNaturalOptions = [
    { value: 0, label: 'Seleccione una opción' },
    { value: 1, label: 'Documento Nacional de Identidad' },
    { value: 2, label: 'Carnet de Extranjería' },
    { value: 3, label: 'Carnet de Identidad de las Fuerzas Armadas' },
    { value: 4, label: 'Carnet de Identidad de las Fuerzas Policiales' },
    { value: 5, label: 'Pasaporte' },
    { value: 6, label: 'Cédula de Ciudadanía' },
    { value: 7, label: 'Cédula Diplomática de Identidad'},
    { value: 8, label: 'Partida de Nacimiento' },
    { value: 9, label: 'Otro' }
]

const PreClientForm = ({ idtipoacto, idtipkar, kardex, setClientesCheck }: Props) => {

    const { setType, setMessage, setShow } = useNotificationsStore()
    const [selectedTipoPersona, setSelectedTipoPersona] = useState(0)   
    const [selectedTipoDocumento, setSelectedTipoDocumento] = useState(1)
    const [document, setDocument] = useState('')
    const [showContratanteForm, setShowContratanteForm] = useState(false)
    const [showClienteForm, setShowClienteForm] = useState(false)
    const [cliente1, setCliente1] = useState<Cliente | null>(null)
    // const token = import.meta.env.VITE_FACTILIZA_TOKEN


    const handleLookup = (e: React.FormEvent) => {

        e.preventDefault()

        if (selectedTipoPersona === 0) {
            setType('error')
            setMessage('Debe seleccionar un tipo de persona y proporcionar un documento válido.')
            setShow(true)
            return
        }

        if (selectedTipoPersona === 1 && document.length !== 8) {
            setType('error')
            setMessage('El DNI debe tener 8 dígitos.')
            setShow(true)
            return
        }
        
        if (selectedTipoPersona === 2 && document.length !== 11) {
            setType('error')
            setMessage('El RUC debe tener 11 dígitos.')
            setShow(true)
            return
        }

        if (selectedTipoDocumento === 0) {
            setType('error')
            setMessage('Debe seleccionar un tipo de documento.')
            setShow(true)
            return
        }

        if (document.length === 0) {
            setType('error')
            setMessage('Debe proporcionar un número de documento.')
            setShow(true)
            return
        }

        // get client here
        axios.get(
            `${import.meta.env.VITE_API_URL}cliente/by_dni/?dni=${document}`
        ).then(response => {
            if (response.data.idcliente) {
                console.log('Cliente encontrado:', response.data);
                setCliente1(response.data)
                setShowContratanteForm(true)
                setShowClienteForm(false)
            } else {
                console.log('Cliente no encontrado, creando nuevo cliente')
                setCliente1(null)
                setShowContratanteForm(false)
                setShowClienteForm(true)
            }
        }).catch(error => {
            console.log('Error al buscar el cliente:', error);
            console.error(error);
        })
            
    }


  return (
    <>
        <div>
        <h2 className="text-xl font-bold text-center mb-10">Buscar Cliente</h2>
        <form
            onSubmit={handleLookup}
            className="grid grid-cols-5 items-center gap-6"
        >
            <Selector 
                label="Tipo de Persona"
                options={[
                    { value: 0, label: 'Seleccione una opción' },
                    { value: 1, label: 'Persona Natural' },
                    { value: 2, label: 'Persona Jurídica' }
                ]}
                setter={setSelectedTipoPersona}
            />
            {selectedTipoPersona > 0 && 
            <>
                <Selector 
                    label="Tipo de documento"
                    options={documentNaturalOptions}
                    setter={setSelectedTipoDocumento}
                    defaultValue={selectedTipoDocumento}
                />
                {selectedTipoDocumento > 0 && 
                <div className="flex flex-col gap-2 col-span-2">
                    <p className="text-md font-bold py-2">{documentNaturalOptions.find(document => document.value === selectedTipoDocumento)?.label}</p>
                    <input 
                        type="text"
                        value={document}
                        onChange={e => setDocument(e.target.value)}
                        placeholder={documentNaturalOptions.find(document => document.value === selectedTipoDocumento)?.label || ''}
                        className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
                    />
                </div>}
                {selectedTipoDocumento > 0 && 
                <button 
                    disabled={document.length === 0}
                    className={`w-[60%] mx-auto bg-blue-600 text-white rounded-md py-2 mt-4 transition-colors duration-300 ${document.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer hover:bg-blue-500'}`} 
                    type="submit">
                    Buscar
                </button>}
            </>
            }
        </form>
    </div>
    {showContratanteForm &&
        <div className="mt-10">
            <CreateContratante 
                cliente1={cliente1}
                setShowContratanteForm={setShowContratanteForm}
                setShowClienteForm={setShowClienteForm}
                setClientesCheck={setClientesCheck}
                idtipoacto={idtipoacto}
                idtipkar={idtipkar}
                kardex={kardex}
                
            />
        </div>
    }
    {showClienteForm &&
        <div className="mt-10">
            {cliente1 
            ? 
            <UpdateCliente 
                setShowContratanteForm={setShowContratanteForm}
                setShowClienteForm={setShowClienteForm}
                setCliente1={setCliente1}
                dni={document}
                cliente1={cliente1}
            />
            : 
            <CreateCliente 
                setShowContratanteForm={setShowContratanteForm}
                setShowClienteForm={setShowClienteForm}
                setCliente1={setCliente1}
                dni={document}
                cliente1={null}
            />}
        </div>
    }
    </>
  )
}

export default PreClientForm