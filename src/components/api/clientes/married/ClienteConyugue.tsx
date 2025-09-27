import { useState } from "react"
import getTitleCase from "../../../../utils/getTitleCase"
import TopModal from "../../../ui/TopModal"
import ClienteConyugeLooker from "./ClienteConyugeLooker"
import { Cliente } from "../../../../services/api/cliente1Service"

interface Props {
    clienteConyuge: string
    setConyuge: React.Dispatch<React.SetStateAction<string>>
    cliente1: Cliente
    civilStatus: number
}

const ClienteConyugue = ({ clienteConyuge, setConyuge, cliente1, civilStatus }: Props) => {

    const [isOpen, setIsOpen] = useState(false)
    const [conyugeName, setConyugeName] = useState(clienteConyuge || '')

  return (
    <>
    {clienteConyuge 
    ? 
    <div className="w-full mx-2 bg-slate-200 rounded-md p-2 text-sm flex items-center justify-between my-2">
        <p>Casado con: {getTitleCase(conyugeName)}</p>
        <button
            onClick={() => setIsOpen(true)}
            type="button"
            className="w-30 border mx-4 bg-yellow-400 border-yellow-500 text-white text-sm rounded-md py-1 px-4 cursor-pointer hover:bg-yellow-500 transition-all duration-300"
        >
            <p>Actualizar</p>
        </button>
    </div>
    :
    <button 
        onClick={() => setIsOpen(true)}
        type="button"
        className="w-full border text-xs bg-blue-600 text-white rounded-md py-2 px-4 cursor-pointer hover:bg-blue-500 transition-all duration-300"
    >Agregar Conyuge</button>
    
    }
    <TopModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
    >
        <ClienteConyugeLooker 
            setConyuge={setConyuge}
            setConyugeName={setConyugeName}
            setIsOpen={setIsOpen}
            cliente1={cliente1}
            civilStatus={civilStatus}
        />
    </TopModal>
    </>
  )
}

export default ClienteConyugue