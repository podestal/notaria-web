import { useState } from "react"
import SimpleInput from "../../ui/SimpleInput"
import { Cliente2 } from "../../../services/api/clienteService"
import { Cliente } from "../../../services/api/cliente1Service"
import ContratantesConditionFilter from "./ContratantesConditionFilter"

interface Props {
    cliente2: Cliente2 | null
    cliente1: Cliente | null
    idtipoacto: string
    setShowContratanteForm: React.Dispatch<React.SetStateAction<boolean>>
    setShowClienteForm: React.Dispatch<React.SetStateAction<boolean>>
}

const ContratantesForm = ({ cliente1, idtipoacto, setShowContratanteForm, setShowClienteForm }: Props) => {

    const [apePaterno, setApePaterno] = useState(cliente1 ? cliente1.apepat : '')
    const [apeMaterno, setApeMaterno] = useState( cliente1 ? cliente1.apemat : '')
    const [prinom, setPrinom] = useState( cliente1 ? cliente1.prinom : '')
    const [segnom, setSegnom] = useState( cliente1 ? cliente1.segnom : '')
    const [address, setAddress] = useState( cliente1 ? cliente1.direccion : '')
    const [selectedActos, setSelectedActos] = useState<string[]>([])

    const handleCreateContratante = (e: React.FormEvent) => {
        e.preventDefault()
    }

  return (
    <>
    {/* <ClientesForm /> */}
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
                />
            </div>
            <div className="col-span-2">
                <SimpleInput 
                    label="Apellido Materno"
                    value={apeMaterno}
                    setValue={setApeMaterno}
                    horizontal
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
                <button className="bg-gray-50 h-full px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md">
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
                <input checked type="checkbox" />
            </div>
            <div className="flex items-center justify-center gap-4">
                <p className="pl-2 block text-xs font-semibold text-slate-700">Incluir en el Indic</p>
                <input checked type="checkbox" />
            </div>
        </div>
    </form>
    </>
  )
}

export default ContratantesForm