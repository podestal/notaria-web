import { useState } from "react"
import SimpleInput from "../../ui/SimpleInput"
import { Cliente } from "../../../services/api/cliente1Service"
import ContratantesConditionFilter from "./ContratantesConditionFilter"
import { CreateContratanteData } from "../../../hooks/api/contratantes/useCreateContratantes"
import { Contratante } from "../../../services/api/contratantesService"
import { UseMutationResult } from "@tanstack/react-query"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useCreateCliente2 from "../../../hooks/api/cliente2/useCreateCliente2"

interface Props {
    cliente1: Cliente | null
    idtipoacto: string
    setShowContratanteForm: React.Dispatch<React.SetStateAction<boolean>>
    setShowClienteForm: React.Dispatch<React.SetStateAction<boolean>>
    createContratante: UseMutationResult<Contratante, Error, CreateContratanteData>
    idtipkar: number
    kardex: string
}

const ContratantesForm = ({ cliente1, idtipoacto, setShowContratanteForm, setShowClienteForm, createContratante, idtipkar, kardex }: Props) => {

    const { setMessage, setShow, setType } = useNotificationsStore()
    const [apePaterno, setApePaterno] = useState(cliente1 ? cliente1.apepat : '')
    const [apeMaterno, setApeMaterno] = useState( cliente1 ? cliente1.apemat : '')
    const [prinom, setPrinom] = useState( cliente1 ? cliente1.prinom : '')
    const [segnom, setSegnom] = useState( cliente1 ? cliente1.segnom : '')
    const [address, setAddress] = useState( cliente1 ? cliente1.direccion : '')
    const [selectedActos, setSelectedActos] = useState<string[]>([])
    const [firma, setFirma] = useState(false)
    const [incluirIndic, setIncluirIndic] = useState(false)
    const createCliente2 = useCreateCliente2()

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


        const formattedActos = selectedActos.map(acto => (`${acto}.xxx`)).join('/')

        createContratante.mutate({
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
                if (cliente1) {
                    createCliente2.mutate({
                        access: '',
                        cliente2: {
                            idcontratante: res.idcontratante,
                            tipper: cliente1.tipper, 
                            apepat: cliente1.apepat,
                            apemat: cliente1.apemat,
                            prinom: cliente1.prinom,
                            segnom: cliente1.segnom,
                            nombre: `${cliente1.prinom} ${cliente1.segnom} ${cliente1.apepat} ${cliente1.apemat}`,
                            direccion: cliente1.direccion,
                            idtipdoc: cliente1.idtipdoc,
                            numdoc: cliente1.numdoc,
                            email: cliente1.email,
                            telfijo: cliente1.telfijo,
                            telcel: cliente1.telcel,
                            telofi: cliente1.telofi || '',
                            sexo: cliente1.sexo || '',
                            idestcivil: cliente1.idestcivil || 0,
                            natper: cliente1.nacionalidad || '',
                            conyuge: '',
                            nacionalidad: cliente1.nacionalidad || '',
                            idprofesion: cliente1.idprofesion || 0,
                            detaprofesion: cliente1.detaprofesion || '',
                            idcargoprofe: cliente1.idcargoprofe || 0,
                            profocupa: cliente1.detaprofesion || '',
                            dirfer: cliente1.direccion,
                            idubigeo: cliente1.idubigeo || '.',
                            cumpclie: cliente1.cumpclie || '.',
                            razonsocial: cliente1.nombre || '',
                            fechaing: '',
                            residente: cliente1.resedente || '0',
                            tipocli: '0',
                            profesion_plantilla: cliente1.detaprofesion || '',
                            ubigeo_plantilla: cliente1.idubigeo || '',
                            fechaconstitu: '',
                            idsedereg: 1
                        }
                    })
                }
            },
            onError: (error) => {
                console.error('Error creating contratante:', error)
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
                    className="bg-gray-50 h-full px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md">
                    Grabar Contratante
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