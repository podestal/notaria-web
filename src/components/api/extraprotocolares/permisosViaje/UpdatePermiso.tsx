import { PermisoViaje } from "../../../../services/api/extraprotocolares/permisoViajeService"
import PermisoForm from "./PermisoForm"

interface Props {
    permisoViaje: PermisoViaje
}


const UpdatePermiso = ({ permisoViaje }: Props) => {
  return (
    <PermisoForm 
        permisoViaje={permisoViaje} 
    />
  )
}

export default UpdatePermiso