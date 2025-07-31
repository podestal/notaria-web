import PermisoCard from "./PermisoCard";
import { PermisoViajePage } from "../../../../services/api/extraprotocolares/permisoViajeService";

interface Props {
   permisosPage: PermisoViajePage
}

const PermisosTableBody = ({ permisosPage }: Props) => {

  return (
    <>
      <>
        { permisosPage.count > 0 
        ? 
        <>
        {permisosPage.results.map((permiso) => (
          <PermisoCard 
            key={permiso.num_formu} 
            permisoViaje={permiso} 
          />
        ))}
        </>
        : 
        <p className="text-center text-xs my-4 py-4 ">No hay permisos de viaje disponibles</p>}
      </> 
    </>
  
  )

}

export default PermisosTableBody