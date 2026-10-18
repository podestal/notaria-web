import { useState } from "react"
import { motion } from "framer-motion"
import { Legalizacion } from "../../../../services/api/extraprotocolares/legalizacionService"
import TopModal from "../../../ui/TopModal"
import UpdateLegalizacion from "./UpdateLegalizacion"
import { rowMotionProps } from "../rowMotion"
import { EXTRA_ID_BADGE_CLASS, EXTRA_ROW_CLASS } from "../ExtraTableShell"
import { LEGALIZACION_GRID_COLUMNS } from "./LegalizacionTableHeader"

interface Props {
    legalizacion: Legalizacion
    index?: number
}

const Empty = () => <span className="text-slate-300">—</span>

const LegalizacionCard = ({ legalizacion, index = 0 }: Props) => {
    const [open, setOpen] = useState(false)

  return (
    <>
        <motion.div
            {...rowMotionProps(index)}
            role="button"
            tabIndex={0}
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setOpen(true)
                }
            }}
            className={`${EXTRA_ROW_CLASS} cursor-pointer`}
            style={{ gridTemplateColumns: LEGALIZACION_GRID_COLUMNS }}
        >
            <div>
                <span className={EXTRA_ID_BADGE_CLASS}>{legalizacion.idlegalizacion || <Empty />}</span>
            </div>
            <p className="tabular-nums text-slate-600">{legalizacion.fechaingreso || <Empty />}</p>
            <p className="font-mono text-slate-800">{legalizacion.dni || <Empty />}</p>
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
