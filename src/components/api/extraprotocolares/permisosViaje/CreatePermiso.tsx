import useCreatePermisoViaje from "../../../../hooks/api/extraprotocolares/permisosViaje/useCreatePermisoViaje"
import PermisoForm from "./PermisoForm"


const CreatePermiso = () => {

    const createPermisoViaje = useCreatePermisoViaje()

  return (
    <PermisoForm 
        createPermisoViaje={createPermisoViaje} 
    />
  )
}

export default CreatePermiso