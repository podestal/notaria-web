import { Pencil } from "lucide-react"
import TopModal from "../../ui/TopModal"
import { useState } from "react"
import { Patrimonial } from "../../../services/api/patrimonialService"
import PatrimonialForm from "./PatrimonialForm"
import { Kardex } from "../../../services/api/kardexService"

interface Props {
    patrimonial: Patrimonial
    kardex: Kardex
}

const UpdatePatrimonial = ({ patrimonial, kardex }: Props) => {

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
        <PatrimonialForm 
            kardex={kardex}
            patrimonial={patrimonial}
        />
    
    </TopModal>

    </>
  )
}

export default UpdatePatrimonial