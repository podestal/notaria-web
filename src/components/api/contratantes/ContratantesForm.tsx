import { useEffect, useState } from "react"
import SimpleInput from "../../ui/SimpleInput"
import { Cliente } from "../../../services/api/cliente1Service"
import ContratantesConditionFilter from "./ContratantesConditionFilter"
import { CreateContratanteData } from "../../../hooks/api/contratantes/useCreateContratantes"
import { Contratante } from "../../../services/api/contratantesService"
import { UseMutationResult } from "@tanstack/react-query"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import SingleSelect from "../../ui/SingleSelect"
import CreateRepresentante from "../representantes/CreateRepresentante"
import TopModal from "../../ui/TopModal"
import { UpdateContratanteData } from "../../../hooks/api/contratantes/useUpdateContratante"

interface Props {
    cliente1: Cliente | null
    idtipoacto: string
    setShowContratanteForm: React.Dispatch<React.SetStateAction<boolean>>
    setShowClienteForm: React.Dispatch<React.SetStateAction<boolean>>
    setClientesCheck: React.Dispatch<React.SetStateAction<boolean>>
    createContratante?: UseMutationResult<Contratante, Error, CreateContratanteData>
    updateContratante?: UseMutationResult<Contratante, Error, UpdateContratanteData>
    idtipkar: number
    kardex: string
    contratante?: Contratante
}

const representationOptions = [
    { value: "0", label: "Derecho propio" },
    { value: "1", label: "Representante" },
    { value: "2", label: "Por derecho propio y representante" },
]

const ContratantesForm = ({ 
    cliente1, 
    idtipoacto, 
    setShowContratanteForm, 
    setShowClienteForm, 
    setClientesCheck, 
    createContratante, 
    updateContratante,
    idtipkar, 
    kardex, 
    contratante }: Props) => {

    const { setMessage, setShow, setType } = useNotificationsStore()
    const [openRepForm, setOpenRepForm] = useState(false)
    const [apePaterno, setApePaterno] = useState(cliente1 ? cliente1.apepat : '')
    const [apeMaterno, setApeMaterno] = useState( cliente1 ? cliente1.apemat : '')
    const [prinom, setPrinom] = useState( cliente1 ? cliente1.prinom : '')
    const [segnom, setSegnom] = useState( cliente1 ? cliente1.segnom : '')
    const [address, setAddress] = useState( cliente1 ? cliente1.direccion : '')
    const [representanteCreated, setRepresentanteCreated] = useState(false)
    const [selectedRepresentation, setSelectedRepresentation] = useState('0')
    const [selectedActos, setSelectedActos] = useState<string[]>(contratante ? contratante.condicion.split('/').map(cond => cond.length > 0 ? cond.split('.')[0]: '').filter(cond => cond.length > 0) : [])
    const [firma, setFirma] = useState(contratante ? contratante.firma === '1' : false)
    const [incluirIndic, setIncluirIndic] = useState(contratante ? contratante.indice === '1' : false)
    const [isLoading, setIsLoading] = useState(false)
    const [contratanteRepresented, setContratanteRepresented] = useState(contratante ? contratante.idcontratanterp : '')

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

        if (selectedRepresentation !== "0" && !representanteCreated) {
            setType('error')
            setMessage('Debe crear un representante.')
            setShow(true)
            return
        }

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
        const joinedActos = selectedActos.join('/')

        createContratante && createContratante.mutate({
            access: '',
            contratante: {
                idtipkar,
                kardex,
                condicion: joinedActos,
                firma: firma ? '1' : '0',
                fechafirma: "",
                resfirma: 0,
                tiporepresentacion: selectedRepresentation, 
                indice: incluirIndic ? '1' : '0',
                visita: '0',
                inscrito: '1',
                idcontratanterp: contratanteRepresented,
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

        updateContratante && updateContratante.mutate({
            access: '',
            contratante: {
                idtipkar,
                kardex,
                condicion: joinedActos,
                firma: firma ? '1' : '0',
                fechafirma: "",
                resfirma: 0,
                tiporepresentacion: selectedRepresentation, 
                indice: incluirIndic ? '1' : '0',
                visita: '0',
                inscrito: '1',
                idcontratanterp: contratanteRepresented,
            }
        }, {
            onSuccess: (res) => {
                console.log('contratante updated', res);
                setType('success')
                setMessage('Contratante actualizado correctamente.')
                setShow(true)
                setShowContratanteForm(false)
                setShowClienteForm(false)
                setClientesCheck(false)
            },
            onError: (error) => {
                console.error('Error updating contratante:', error)
                setType('error')
                setMessage('Error al actualizar el contratante. Por favor, inténtelo de nuevo.')
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
                    disabled={true}
                />
            </div>
            <div className="col-span-2">
                <SimpleInput 
                    label="Apellido Materno"
                    value={apeMaterno}
                    setValue={setApeMaterno}
                    horizontal
                    required
                    disabled={true}
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
                    disabled={true}
                />
            </div>
            <div className="col-span-2">
                <SimpleInput 
                    label="Segundo Nombre"
                    value={segnom}
                    setValue={setSegnom}
                    horizontal
                    disabled={true}
                />
            </div>
            <div className="w-full flex justify-center items-center gap-4">
                <button 
                    disabled={isLoading}
                    className="bg-gray-50 h-full px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md">
                    {isLoading ? 'Un momento...' : `${contratante ? 'Actualizar Contratante' : 'Crear Contratante'}`}
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
                    disabled={true}
                />
            </div>
            <div className="w-full flex justify-center items-center gap-4">
                {contratante 
                ? 
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
                : 
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
                }
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
        <div className="my-6">
            <p className="text-xs font-semibold text-slate-700 mb-4">Tipo de Representación</p>
            <SingleSelect 
                options={representationOptions}
                selected={selectedRepresentation}
                onChange={(value) => {
                    if (value !== "0") {
                        setOpenRepForm(true)
                    }
                    setSelectedRepresentation(value)
                }}
                disabled={selectedActos.length === 0}
            />
        </div>
    </form>
    <TopModal
        isOpen={openRepForm}
        onClose={() => setOpenRepForm(false)}
    >
        <CreateRepresentante 
            kardex={kardex}
            setRepresentanteCreated={setRepresentanteCreated}
            setContratanteRepresented={setContratanteRepresented}
        />
    </TopModal>
    </>
  )
}

export default ContratantesForm