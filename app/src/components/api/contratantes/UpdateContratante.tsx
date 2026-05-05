import { Pencil } from "lucide-react"
import { Contratante } from "../../../services/api/contratantesService"
import TopModal from "../../ui/TopModal"
import { useState } from "react"
import PreUpdateContratantesForm from "./PreUpdateContratantesForm"

interface Props {
    idtipoacto: string
    idtipkar: number
    kardex: string
    idkardex?: number
    contratante: Contratante
}

const UpdateContratante = ({ idtipoacto, idtipkar, kardex, idkardex, contratante }: Props) => {
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
            idkardex={idkardex}
            contratante={contratante}
            setCloseUpdateContratante={setOpen}
        />
    
    </TopModal>

    </>
  )
}

export default UpdateContratante