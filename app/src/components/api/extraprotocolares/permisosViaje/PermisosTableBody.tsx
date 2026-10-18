import { motion } from "framer-motion";
import PermisoCard from "./PermisoCard";
import { PermisoViajePage } from "../../../../services/api/extraprotocolares/permisoViajeService";
import { emptyMotionProps } from "../rowMotion";

interface Props {
   permisosPage: PermisoViajePage
   readyOnly?: boolean
}

const PermisosTableBody = ({ permisosPage, readyOnly }: Props) => {

  return (
    <>
        { permisosPage.count > 0 
        ? 
        <>
        {permisosPage.results.map((permiso, index) => (
          <PermisoCard 
            key={permiso.num_formu} 
            permisoViaje={permiso} 
            readyOnly={readyOnly}
            index={index}
          />
        ))}
        </>
        : 
        <motion.p {...emptyMotionProps} className="text-center text-xs my-4 py-4 text-slate-500">No hay permisos de viaje disponibles</motion.p>}
    </>
  
  )

}

export default PermisosTableBody