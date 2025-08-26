import { IngresoCartas } from "../../../../services/api/extraprotocolares/ingresoCartas"
import CartasNotarialesTableBody from "./CartasNotarialesTableBody"
import CartasNotarialesTableHeader from "./CartasNotarialesTableHeader"

interface Props {
    ingresoCartas: IngresoCartas[]
    page: number
    readyOnly?: boolean
}

const CartasNotarialesTable = ({ ingresoCartas, page, readyOnly }: Props) => {
  return (
    <>
        <CartasNotarialesTableHeader />
        <CartasNotarialesTableBody ingresoCartas={ingresoCartas} page={page} readyOnly={readyOnly} />
    </>
  )
}

export default CartasNotarialesTable