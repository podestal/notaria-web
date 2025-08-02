import { useState } from "react";
import { IngresoCartas } from "../../../../services/api/extraprotocolares/ingresoCartas"
import TopModal from "../../../ui/TopModal";
import PreCartasNotarialesForm from "./PreCartasNotarialesForm";

interface Props {
    carta: IngresoCartas
    page: number
}

const CartasNotarialesCard = ({ carta }: Props) => {

  const [open, setOpen] = useState(false);

  return (
      <>
      <div className="grid grid-cols-7 gap-4 justify-center items-center text-center text-black text-xs p-2 my-4 mx-6">
        <p
          onClick={() => setOpen(true)}
          className="text-center text-blue-600 cursor-pointer hover:text-blue-500"
        >{carta.num_carta}</p>
        <p>{carta.fec_ingreso}</p>
        <p>{carta.fec_entrega}</p>
        <p className="col-span-2">{carta.nom_remitente}</p>
        <p className="col-span-2">{carta.nom_destinatario}</p>
      </div>
      <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <PreCartasNotarialesForm carta={carta} />
      </TopModal>
      </>
  )
}

export default CartasNotarialesCard