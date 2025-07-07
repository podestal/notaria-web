import { Pencil } from "lucide-react"
import TopModal from "../../ui/TopModal"
import { useState } from "react"
import DetalleMediosDePagoForm from "./DetalleMediosDePagoForm"
import { Patrimonial } from "../../../services/api/patrimonialService"
import { DetalleMedioDePago } from "../../../services/api/detalleMedioDePago"
import useUpdateDetalleMedioDePago from "../../../hooks/api/detalleMedioDePago/useUpdateDetalleMedioDePago"

interface Props {
  patrimonial: Patrimonial
  detalleMedioDePago: DetalleMedioDePago
}

const UpdateDetalleMediosDePago = ({ patrimonial, detalleMedioDePago }: Props) => {

  const [open, setOpen] = useState(false)
  const updateDetalleMedioDePago = useUpdateDetalleMedioDePago({ itemmp: patrimonial.itemmp, medioDePagoId: detalleMedioDePago.detmp, kardex: detalleMedioDePago.kardex });

  return (
    <>
    <button
        onClick={() =>{setOpen(true)}}
        type="button"
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
        <DetalleMediosDePagoForm 
          patrimonial={patrimonial}
          detalleMedioDePago={detalleMedioDePago}
          updateDetalleMedioDePago={updateDetalleMedioDePago}
        />
    
    </TopModal>
    </>
  )
}

export default UpdateDetalleMediosDePago