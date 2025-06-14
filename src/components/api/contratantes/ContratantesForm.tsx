import { useEffect, useState } from "react"
import SimpleInput from "../../ui/SimpleInput"
import { Cliente } from "../../../services/api/cliente1Service"
import ContratantesConditionFilter from "./ContratantesConditionFilter"
import { CreateContratanteData } from "../../../hooks/api/contratantes/useCreateContratantes"
import { Contratante } from "../../../services/api/contratantesService"
import { UseMutationResult } from "@tanstack/react-query"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"

interface Props {
    cliente1: Cliente | null
    idtipoacto: string
    setShowContratanteForm: React.Dispatch<React.SetStateAction<boolean>>
    setShowClienteForm: React.Dispatch<React.SetStateAction<boolean>>
    setClientesCheck: React.Dispatch<React.SetStateAction<boolean>>
    createContratante: UseMutationResult<Contratante, Error, CreateContratanteData>
    idtipkar: number
    kardex: string
}

const ContratantesForm = ({ cliente1, idtipoacto, setShowContratanteForm, setShowClienteForm, setClientesCheck, createContratante, idtipkar, kardex }: Props) => {

    const { setMessage, setShow, setType } = useNotificationsStore()
    const [apePaterno, setApePaterno] = useState(cliente1 ? cliente1.apepat : '')
    const [apeMaterno, setApeMaterno] = useState( cliente1 ? cliente1.apemat : '')
    const [prinom, setPrinom] = useState( cliente1 ? cliente1.prinom : '')
    const [segnom, setSegnom] = useState( cliente1 ? cliente1.segnom : '')
    const [address, setAddress] = useState( cliente1 ? cliente1.direccion : '')
    const [selectedActos, setSelectedActos] = useState<string[]>([])
    const [firma, setFirma] = useState(false)
    const [incluirIndic, setIncluirIndic] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        console.log('cliente1', cliente1);
        if (cliente1) {
            setApePaterno(cliente1.apepat)
            setApeMaterno(cliente1.apemat)
            setPrinom(cliente1.prinom)
            setSegnom(cliente1.segnom)
            setAddress(cliente1.direccion)
        } else {
            setApePaterno('')
            setApeMaterno('')
            setPrinom('')
            setSegnom('')
            setAddress('')
        }
    }, [cliente1])

    const handleCreateContratante = (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedActos.length === 0) {
            setType('error')
            setMessage('Debe seleccionar al menos una condición para el contratante.')
            setShow(true)
            return
        }

        if (!apePaterno) {
            setType('error')
            setMessage('El apellido paterno es obligatorio.')
            setShow(true)
            return
        }

        if (!prinom) {
            setType('error')
            setMessage('El primer nombre es obligatorio.')
            setShow(true)
            return
        }

        if (!apeMaterno) {
            setType('error')
            setMessage('El apellido materno es obligatorio.')
            setShow(true)
            return
        }

        if (!address) {
            setType('error')
            setMessage('La dirección es obligatoria.')
            setShow(true)
            return
        }

        setIsLoading(true)
        const formattedActos = selectedActos.map(acto => (`${acto}.xxx`)).join('/')

        createContratante.mutate({
            access: '',
            contratante: {
                idtipkar,
                kardex,
                condicion: formattedActos,
                firma: firma ? '1' : '0',
                fechafirma: "0000",
                resfirma: 0,
                tiporepresentacion: '0', 
                indice: incluirIndic ? '1' : '0',
                visita: '0',
                inscrito: '1',
                
            }
        }, {

            onSuccess: (res) => {
                console.log('contratante', res);
                setType('success')
                setMessage('Contratante creado correctamente.')
                setShow(true)
                setShowContratanteForm(false)
                setShowClienteForm(false)
                setClientesCheck(false)
            },
            onError: (error) => {
                console.error('Error creating contratante:', error)
                setType('error')
                setMessage('Error al crear el contratante. Por favor, inténtelo de nuevo.')
                setShow(true)
            },
            onSettled: () => {
                setIsLoading(false)
            }
        })


    }

  return (
    <>
    <form
        onSubmit={handleCreateContratante}
    >
        <h2 className="text-xl text-center font-bold mb-6">Nuevo Contratante</h2>
        <div className="grid grid-cols-5 gap-4">
            <div className="col-span-2">
                <SimpleInput 
                    label="Apellido Paterno"
                    value={apePaterno}
                    setValue={setApePaterno}
                    horizontal
                    required
                />
            </div>
            <div className="col-span-2">
                <SimpleInput 
                    label="Apellido Materno"
                    value={apeMaterno}
                    setValue={setApeMaterno}
                    horizontal
                    required
                />
            </div>
            <ContratantesConditionFilter 
                idtipoacto={idtipoacto}
                selectedActos={selectedActos}
                setSelectedActos={setSelectedActos}
            />
        </div>
        <div className="grid grid-cols-5 gap-4 mt-4">
            <div className="col-span-2">
                <SimpleInput 
                    label="Primer Nombre"
                    value={prinom}
                    setValue={setPrinom}
                    horizontal
                    required
                />
            </div>
            <div className="col-span-2">
                <SimpleInput 
                    label="Segundo Nombre"
                    value={segnom}
                    setValue={setSegnom}
                    horizontal
                />
            </div>
            <div className="w-full flex justify-center items-center gap-4">
                <button 
                    disabled={isLoading}
                    className="bg-gray-50 h-full px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md">
                    {isLoading ? 'Un momento...' : 'Crear Contratante'}
                </button>
            </div>
        </div>
        <div className="grid grid-cols-5 gap-4 mt-4">
            <div className="col-span-4 w-full">
                <SimpleInput 
                    label="Dirección"
                    value={address}
                    setValue={setAddress}
                    horizontal
                    fullWidth
                    required
                />
            </div>
            <div className="w-full flex justify-center items-center gap-4">
                <button 
                    className="bg-gray-50 h-full px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md"
                    type="button"
                    onClick={() => {
                        setShowContratanteForm(false)
                        setShowClienteForm(true)
                    }}
                >
                    Editar Cliente
                </button>
            </div>
        </div>
        <div className="flex items-center justify-start gap-10 mt-6">
            <div className="flex items-center justify-center gap-4">
                <p className="pl-2 block text-xs font-semibold text-slate-700">Firma</p>
                <input 
                    type="checkbox"  
                    checked={firma}
                    onChange={(e) => setFirma(e.target.checked)}    
                />
            </div>
            <div className="flex items-center justify-center gap-4">
                <p className="pl-2 block text-xs font-semibold text-slate-700">Incluir en el Indic</p>
                <input 
                    type="checkbox" 
                    checked={incluirIndic}
                    onChange={(e) => setIncluirIndic(e.target.checked)}
                />
            </div>
        </div>
    </form>
    </>
  )
}

export default ContratantesForm