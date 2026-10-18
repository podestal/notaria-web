import { IngresoCartas } from "../../../../services/api/extraprotocolares/ingresoCartas"
import ExtraTableShell from "../ExtraTableShell"
import CartasNotarialesTableBody from "./CartasNotarialesTableBody"
import CartasNotarialesTableHeader from "./CartasNotarialesTableHeader"

interface Props {
    ingresoCartas: IngresoCartas[]
    page: number
    readyOnly?: boolean
    totalCount?: number
}

const CartasNotarialesTable = ({ ingresoCartas, page, readyOnly, totalCount }: Props) => {
  return (
    <ExtraTableShell
      count={totalCount ?? ingresoCartas.length}
      label="cartas encontradas"
      hint={readyOnly ? undefined : "Haga clic en una fila para abrir la carta"}
      minWidth="920px"
    >
      <CartasNotarialesTableHeader />
      <CartasNotarialesTableBody ingresoCartas={ingresoCartas} page={page} readyOnly={readyOnly} />
    </ExtraTableShell>
  )
}

export default CartasNotarialesTable
