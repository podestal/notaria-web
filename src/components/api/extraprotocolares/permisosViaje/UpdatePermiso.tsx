import useUpdatePermisoViaje from "../../../../hooks/api/extraprotocolares/permisosViaje/useUpdatePermisoViaje";
import { PermisoViaje } from "../../../../services/api/extraprotocolares/permisoViajeService"
import PermisoForm from "./PermisoForm"

interface Props {
    permisoViaje: PermisoViaje
}


const UpdatePermiso = ({ permisoViaje }: Props) => {

    const updatePermisoViaje = useUpdatePermisoViaje({ page: 1, permisoViajeId: permisoViaje.id_viaje });

  return (
    <PermisoForm 
        permisoViaje={permisoViaje} 
        updatePermisoViaje={updatePermisoViaje}
    />
  )
}

export default UpdatePermiso