import { motion } from "framer-motion"
import { IngresoCartas } from "../../../../services/api/extraprotocolares/ingresoCartas"
import CartasNotarialesCard from "./CartasNotarialesCard"
import { emptyMotionProps } from "../rowMotion"

interface Props {
    ingresoCartas: IngresoCartas[]
    page: number
    readyOnly?: boolean
}

const CartasNotarialesTableBody = ({ ingresoCartas, page, readyOnly }: Props) => {
  return (
    <>
    {ingresoCartas.length > 0 ? (
        <>
            {ingresoCartas.map((carta, index) => (
                <CartasNotarialesCard 
                    key={carta.id_carta}
                    carta={carta}
                    page={page}
                    readyOnly={readyOnly}
                    index={index}
                />
            ))}
        </>
    ) : (
        <motion.div {...emptyMotionProps} className="text-center text-xs my-4 text-slate-500">No hay cartas para mostrar</motion.div>
    )}
    </>
  )
}

export default CartasNotarialesTableBody