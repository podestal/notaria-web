import { IngresoCartas } from "../../../../services/api/extraprotocolares/ingresoCartas"
import CartasNotarialesTableBody from "./CartasNotarialesTableBody"
import CartasNotarialesTableHeader from "./CartasNotarialesTableHeader"

interface Props {
    ingresoCartas: IngresoCartas[]
    page: number
}

const CartasNotarialesTable = ({ ingresoCartas, page }: Props) => {
  return (
    <>
        <CartasNotarialesTableHeader />
        <CartasNotarialesTableBody ingresoCartas={ingresoCartas} page={page} />
    </>
  )
}

export default CartasNotarialesTable