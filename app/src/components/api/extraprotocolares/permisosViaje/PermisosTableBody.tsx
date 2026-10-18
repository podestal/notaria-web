import { motion } from "framer-motion";
import { FileSearch } from "lucide-react";
import PermisoCard from "./PermisoCard";
import { PermisoViajePage } from "../../../../services/api/extraprotocolares/permisoViajeService";
import { emptyMotionProps } from "../rowMotion";

interface Props {
   permisosPage: PermisoViajePage
   readyOnly?: boolean
}

const PermisosTableBody = ({ permisosPage, readyOnly }: Props) => {
  if (!permisosPage.count || permisosPage.results.length === 0) {
    return (
      <motion.div {...emptyMotionProps} className="flex flex-col items-center justify-center gap-2 px-4 py-14 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <FileSearch className="h-5 w-5" aria-hidden />
        </span>
        <p className="text-sm font-medium text-slate-600">No hay permisos de viaje disponibles</p>
        <p className="text-xs text-slate-400">Pruebe con otros filtros de búsqueda.</p>
      </motion.div>
    )
  }

  return (
    <div className="divide-y divide-slate-100">
      {permisosPage.results.map((permiso, index) => (
        <PermisoCard
          key={permiso.num_formu}
          permisoViaje={permiso}
          readyOnly={readyOnly}
          index={index}
        />
      ))}
    </div>
  )
}

export default PermisosTableBody
