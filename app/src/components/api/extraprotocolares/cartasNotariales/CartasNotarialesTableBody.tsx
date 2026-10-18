import { motion } from "framer-motion"
import { FileSearch } from "lucide-react"
import { IngresoCartas } from "../../../../services/api/extraprotocolares/ingresoCartas"
import CartasNotarialesCard from "./CartasNotarialesCard"
import { emptyMotionProps } from "../rowMotion"

interface Props {
    ingresoCartas: IngresoCartas[]
    page: number
    readyOnly?: boolean
}

const CartasNotarialesTableBody = ({ ingresoCartas, page, readyOnly }: Props) => {
  if (ingresoCartas.length === 0) {
    return (
      <motion.div {...emptyMotionProps} className="flex flex-col items-center justify-center gap-2 px-4 py-14 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <FileSearch className="h-5 w-5" aria-hidden />
        </span>
        <p className="text-sm font-medium text-slate-600">No hay cartas para mostrar</p>
        <p className="text-xs text-slate-400">Pruebe con otros filtros de búsqueda.</p>
      </motion.div>
    )
  }

  return (
    <div className="divide-y divide-slate-100">
      {ingresoCartas.map((carta, index) => (
        <CartasNotarialesCard
          key={carta.id_carta}
          carta={carta}
          page={page}
          readyOnly={readyOnly}
          index={index}
        />
      ))}
    </div>
  )
}

export default CartasNotarialesTableBody
