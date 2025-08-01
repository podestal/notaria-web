import { IngresoCartas } from "../../../../services/api/extraprotocolares/ingresoCartas"

interface Props {
    carta: IngresoCartas
    page: number
}

const CartasNotarialesCard = ({ carta }: Props) => {
  return (
        <div className="grid grid-cols-7 gap-4 justify-center items-center text-center text-black text-xs p-2 my-4 mx-6">
        <div>{carta.num_carta}</div>
        <div>{carta.fec_ingreso}</div>
        <div>{carta.fec_entrega}</div>
        <div className="col-span-2">{carta.nom_remitente}</div>
        <div className="col-span-2">{carta.nom_destinatario}</div>
    </div>
  )
}

export default CartasNotarialesCard