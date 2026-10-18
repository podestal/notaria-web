import { useState } from "react"
import { motion } from "framer-motion"
import { Legalizacion } from "../../../../services/api/extraprotocolares/legalizacionService"
import TopModal from "../../../ui/TopModal"
import UpdateLegalizacion from "./UpdateLegalizacion"
import { rowMotionProps } from "../rowMotion"

interface Props {
    legalizacion: Legalizacion
    index?: number
}

const LegalizacionCard = ({ legalizacion, index = 0 }: Props) => {

    const [open, setOpen] = useState(false)

  return (
    <>
        <motion.div
            {...rowMotionProps(index)}
            className="grid grid-cols-3 gap-4 justify-center items-center text-center text-xs mt-4 px-2 py-2 transition-colors hover:bg-sky-50/60"
        >
            <p 
                onClick={() => setOpen(true)}
                className="text-blue-700 cursor-pointer hover:text-blue-500">{legalizacion.idlegalizacion}</p>
            <p>{legalizacion.fechaingreso}</p>
            <p>{legalizacion.dni}</p>
        </motion.div>
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