import { useState } from "react"
import TopModal from "../../ui/TopModal"
import { Pencil } from "lucide-react"


const UpdateDetalleBien = () => {

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
        {/* <PreUpdateContratantesForm 
            idtipoacto={idtipoacto}
            idtipkar={idtipkar}
            kardex={kardex}
            contratante={contratante}
            setCloseUpdateContratante={setOpen}
        /> */}
        <p>Actualizar detalle de bien</p>

    </TopModal>

    </>
  )
}

export default UpdateDetalleBien