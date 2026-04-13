import { useState } from "react"
import { Legalizacion } from "../../../../services/api/extraprotocolares/legalizacionService"
import TopModal from "../../../ui/TopModal"
import UpdateLegalizacion from "./UpdateLegalizacion"

interface Props {
    legalizacion: Legalizacion
}

const LegalizacionCard = ({ legalizacion }: Props) => {

    const [open, setOpen] = useState(false)

  return (
    <>
        <div className="grid grid-cols-3 gap-4 justify-center items-center text-center text-xs mt-4">
            <p 
                onClick={() => setOpen(true)}
                className="text-blue-700 cursor-pointer hover:text-blue-500">{legalizacion.idlegalizacion}</p>
            <p>{legalizacion.fechaingreso}</p>
            <p>{legalizacion.dni}</p>
        </div>
        <TopModal
            isOpen={open}
            onClose={() => setOpen(false)}
        >
            <UpdateLegalizacion />
        </TopModal>
    </>
  )
}

export default LegalizacionCard