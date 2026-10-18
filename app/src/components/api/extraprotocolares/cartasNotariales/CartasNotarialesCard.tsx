import { useState } from "react";
import { motion } from "framer-motion";
import { IngresoCartas } from "../../../../services/api/extraprotocolares/ingresoCartas"
import TopModal from "../../../ui/TopModal";
import UpdateCartasNotariales from "./UpdateCartasNotariales";
import getTitleCase from "../../../../utils/getTitleCase";
import { rowMotionProps } from "../rowMotion";
import { EXTRA_ID_BADGE_CLASS, EXTRA_ROW_CLASS } from "../ExtraTableShell";
import { CARTAS_GRID_COLUMNS } from "./CartasNotarialesTableHeader";

interface Props {
    carta: IngresoCartas
    page: number
    readyOnly?: boolean
    index?: number
}

const Empty = () => <span className="text-slate-300">—</span>

const CartasNotarialesCard = ({ carta, readyOnly, index = 0 }: Props) => {
  const [open, setOpen] = useState(false);
  const openRow = () => {
    if (readyOnly) return
    setOpen(true)
  }

  return (
      <>
      <motion.div
        {...rowMotionProps(index)}
        role={readyOnly ? undefined : "button"}
        tabIndex={readyOnly ? undefined : 0}
        onClick={openRow}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            openRow()
          }
        }}
        className={`${EXTRA_ROW_CLASS} ${readyOnly ? "" : "cursor-pointer"}`}
        style={{ gridTemplateColumns: CARTAS_GRID_COLUMNS }}
      >
        <div>
          <span className={EXTRA_ID_BADGE_CLASS}>{carta.num_carta || <Empty />}</span>
        </div>
        <p className="tabular-nums text-slate-600">{carta.fec_ingreso || <Empty />}</p>
        <p className="tabular-nums text-slate-600">{carta.fec_entrega || <Empty />}</p>
        <p className="font-medium leading-snug text-slate-800">
          {getTitleCase(carta.nom_remitente || "") || <Empty />}
        </p>
        <p className="leading-snug text-slate-700">
          {getTitleCase(carta.nom_destinatario || "") || <Empty />}
        </p>
      </motion.div>
      <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <UpdateCartasNotariales carta={carta} />
      </TopModal>
      </>
  )
}

export default CartasNotarialesCard
