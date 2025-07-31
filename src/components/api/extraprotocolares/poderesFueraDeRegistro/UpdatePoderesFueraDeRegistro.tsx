import useUpdateIngresoPoderes from "../../../../hooks/api/extraprotocolares/ingresoPoderes/UpdateIngresoPoderes"
import { IngresoPoderes } from "../../../../services/api/extraprotocolares/ingresoPoderes"
import PoderesFueraDeRegistroForm from "./PoderesFueraDeRegistroForm"

interface Props {
    poder: IngresoPoderes
    page: number
}

const UpdatePoderesFueraDeRegistro = ({ poder, page }: Props) => {

  const updateIngresoPoder = useUpdateIngresoPoderes({ page, ingresoPoderesId: poder.id_poder });

  return (
    <PoderesFueraDeRegistroForm 
      poder={poder}
      updateIngresoPoder={updateIngresoPoder}
    />
  )
}

export default UpdatePoderesFueraDeRegistro