import axios from "axios";
import useNotificationsStore from "../../../../../hooks/store/useNotificationsStore";
import { useState } from "react";
import Selector from "../../../../ui/Selector";
import { documentNaturalOptions, documentoJuridicaOptions } from "../../../../../data/clienteData";
import { Cliente } from "../../../../../services/api/cliente1Service";
import ContratantesForm from "./ContratantesForm";
import ContratanteFormJuridica from "./ContratanteFormJuridica";

interface Props {
    poderId: number;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const PreContratanteForm = ({ poderId, setOpen }: Props) => {

    const { setType, setMessage, setShow } = useNotificationsStore()
    const [selectedTipoPersona, setSelectedTipoPersona] = useState(0)   
    const [selectedTipoDocumento, setSelectedTipoDocumento] = useState(1)
    const [document, setDocument] = useState('')
    const [showContratanteForm, setShowContratanteForm] = useState(false)
    const [showClienteForm, setShowClienteForm] = useState(false)
    const [cliente1, setCliente1] = useState<Cliente | null>(null)
    const [loading, setLoading] = useState(false)

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
        setLoading(true)

        // get client here
        if (selectedTipoPersona === 1) {
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
            }).finally(() => {
                setLoading(false)
            })
        }

        if (selectedTipoPersona === 2) {
            axios.get(
                `${import.meta.env.VITE_API_URL}cliente/by_ruc/?ruc=${document}`
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
            }).finally(() => {
                setLoading(false)
            })
        }
    }

  return (
    <div>
        <h2 className="text-xl font-bold text-center mb-10 text-black">Buscar Cliente</h2>
        <form
            onSubmit={handleLookup}
            className="grid grid-cols-5 items-center gap-6 text-black"
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
            {selectedTipoPersona === 1 && 
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
                    disabled={document.length === 0 || loading}
                    className={`w-[60%] mx-auto bg-blue-600 text-white rounded-md py-2 mt-4 transition-colors duration-300 ${loading && 'animate-pulse'} ${document.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer hover:bg-blue-500'}`} 
                    type="submit">
                    {loading ? '...' : 'Buscar'}
                </button>}
            </>
            }
            {selectedTipoPersona === 2 && 
            <>
                <Selector 
                    label="Tipo de documento"
                    options={documentoJuridicaOptions}
                    setter={setSelectedTipoDocumento}
                    defaultValue={selectedTipoDocumento}
                />
                <div className="flex flex-col gap-2 col-span-2">
                    <p className="text-md font-bold py-2">RUC</p>
                    <input 
                        type="text"
                        value={document}
                        onChange={e => setDocument(e.target.value)}
                        placeholder={'Ingrese el RUC'}
                        className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
                    />
                </div>
                {selectedTipoDocumento > 0 && 
                <button 
                    disabled={loading}
                    className={`w-[60%] mx-auto bg-blue-600 text-white rounded-md py-2 mt-4 transition-colors duration-300 ${loading && 'animate-pulse'} ${document.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer hover:bg-blue-500'}`} 
                    type="submit">
                    {loading ? '...' : 'Buscar'}
                </button>}
            </>
            }
        </form>
        {showContratanteForm && cliente1 && 
        <>
            {selectedTipoPersona === 1 && <ContratantesForm cliente1={cliente1} poderId={poderId} setOpen={setOpen} />}
            {selectedTipoPersona === 2 && <ContratanteFormJuridica cliente1={cliente1} poderId={poderId} setOpen={setOpen} />}
        </>}
        {showClienteForm &&
            <p>Formulario de Cliente</p>
        }
    </div>
  )
}

export default PreContratanteForm