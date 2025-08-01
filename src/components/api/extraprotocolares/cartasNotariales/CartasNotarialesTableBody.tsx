import { IngresoCartas } from "../../../../services/api/extraprotocolares/ingresoCartas"
import CartasNotarialesCard from "./CartasNotarialesCard"

interface Props {
    ingresoCartas: IngresoCartas[]
    page: number
}

const CartasNotarialesTableBody = ({ ingresoCartas, page }: Props) => {
  return (
    <>
    {ingresoCartas.length > 0 ? (
        <>
            {ingresoCartas.map((carta) => (
                <CartasNotarialesCard 
                    key={carta.id_carta}
                    carta={carta}
                    page={page}
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