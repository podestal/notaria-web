import useCreateIngresoCarta from "../../../../hooks/api/extraprotocolares/ingresoCartas/useCreateIngresoCarta"
import PreCartasNotarialesForm from "./PreCartasNotarialesForm"


const CreateCartasNotariales = () => {

    const createIngresoCarta = useCreateIngresoCarta();

  return (
    <PreCartasNotarialesForm 
        createIngresoCarta={createIngresoCarta}
    />
  )
}

export default CreateCartasNotariales