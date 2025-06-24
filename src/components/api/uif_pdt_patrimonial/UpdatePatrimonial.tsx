import { Pencil } from "lucide-react"
import TopModal from "../../ui/TopModal"
import { useState } from "react"
import { Patrimonial } from "../../../services/api/patrimonialService"
import PatrimonialForm from "./PatrimonialForm"
import { Kardex } from "../../../services/api/kardexService"
import useUpdatePatrimonial from "../../../hooks/api/patrimonial/useUpdatePatrimonial"

interface Props {
    patrimonial: Patrimonial
    kardex: Kardex
}

const UpdatePatrimonial = ({ patrimonial, kardex }: Props) => {

    const [open, setOpen] = useState(false)
    const updatePatrimonial = useUpdatePatrimonial({ idPatrimonial: patrimonial.itemmp })

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
            updatePatrimonial={updatePatrimonial}
        />
    
    </TopModal>

    </>
  )
}

export default UpdatePatrimonial