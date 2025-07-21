import { useState } from "react"
import TopModal from "../../ui/TopModal"
import { Pencil } from "lucide-react"
import { DetalleBien } from "../../../services/api/detalleBienService"
import PreDetalleBienForm from "./PreDetalleBienForm"

interface Props {
    detalleBien: DetalleBien
}


const UpdateDetalleBien = ({ detalleBien }: Props) => {

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
        <PreDetalleBienForm 
            detalleBien={detalleBien}
            kardex={detalleBien.kardex}
            idtipoacto={detalleBien.idtipacto}
            itemmp={detalleBien.itemmp}
        />

    </TopModal>

    </>
  )
}

export default UpdateDetalleBien