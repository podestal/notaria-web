import useUpdateIngresoCarta from "../../../../hooks/api/extraprotocolares/ingresoCartas/useUpdateIngresoCarta";
import { IngresoCartas } from "../../../../services/api/extraprotocolares/ingresoCartas"
import PreCartasNotarialesForm from "./PreCartasNotarialesForm"

interface Props {
    carta: IngresoCartas
}

const UpdateCartasNotariales = ({ carta }: Props) => {

    const updateCartaNotarial = useUpdateIngresoCarta({ ingresoCartasId: carta.id_carta });

  return (
    <PreCartasNotarialesForm 
        carta={carta} 
        updateCartaNotarial={updateCartaNotarial}/>
  )
}

export default UpdateCartasNotariales