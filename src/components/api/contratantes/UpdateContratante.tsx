import { Pencil } from "lucide-react"
import { Contratante } from "../../../services/api/contratantesService"
import TopModal from "../../ui/TopModal"
import { useState } from "react"
import PreUpdateContratantesForm from "./PreUpdateContratantesForm"

interface Props {
    idtipoacto: string
    idtipkar: number
    kardex: string
    contratante: Contratante
}

const UpdateContratante = ({ idtipoacto, idtipkar, kardex, contratante }: Props) => {

    console.log('idtipoacto', idtipoacto)
    const [open, setOpen] = useState(false)

  return (
    <>
    <button
        onClick={() =>{
            setOpen(true)}}
    >
        <Pencil 
            size={20}
            className="text-blue-500 hover:text-blue-400 cursor-pointer"
        />
    </button>
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
    >
        <PreUpdateContratantesForm 
            idtipoacto={idtipoacto}
            idtipkar={idtipkar}
            kardex={kardex}
            contratante={contratante}
        />
    
    </TopModal>

    </>
  )
}

export default UpdateContratante