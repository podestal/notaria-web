import { IngresoCartas } from "../../../../services/api/extraprotocolares/ingresoCartas"
import CartasNotarialesCard from "./CartasNotarialesCard"

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
            {ingresoCartas.map((carta) => (
                <CartasNotarialesCard 
                    key={carta.id_carta}
                    carta={carta}
                    page={page}
                    readyOnly={readyOnly}
                />
            ))}
        </>
    ) : (
        <div className="text-center text-xs my-4">No hay cartas para mostrar</div>
    )}
    </>
  )
}

export default CartasNotarialesTableBody