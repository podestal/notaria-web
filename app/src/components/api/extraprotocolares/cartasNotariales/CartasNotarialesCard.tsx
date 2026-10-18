import { useState } from "react";
import { motion } from "framer-motion";
import { IngresoCartas } from "../../../../services/api/extraprotocolares/ingresoCartas"
import TopModal from "../../../ui/TopModal";
import UpdateCartasNotariales from "./UpdateCartasNotariales";
import getTitleCase from "../../../../utils/getTitleCase";
import { rowMotionProps } from "../rowMotion";

interface Props {
    carta: IngresoCartas
    page: number
    readyOnly?: boolean
    index?: number
}

const CartasNotarialesCard = ({ carta, readyOnly, index = 0 }: Props) => {

  const [open, setOpen] = useState(false);

  return (
      <>
      <motion.div
        {...rowMotionProps(index)}
        className="grid grid-cols-7 gap-4 justify-center items-center text-center text-slate-800 text-xs p-2 my-4 mx-6 transition-colors hover:bg-sky-50/60"
      >
        <p
          onClick={() => {
            if (readyOnly) return;
            setOpen(true)
          }}
          className="text-center text-blue-600 cursor-pointer hover:text-blue-500"
        >{carta.num_carta}</p>
        <p>{carta.fec_ingreso}</p>
        <p>{carta.fec_entrega}</p>
        <p className="col-span-2">{getTitleCase(carta.nom_remitente || "")}</p>
        <p className="col-span-2">{getTitleCase(carta.nom_destinatario || "")}</p>
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