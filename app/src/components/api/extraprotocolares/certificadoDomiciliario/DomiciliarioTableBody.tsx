import { motion } from "framer-motion"
import { FileSearch } from "lucide-react"
import { Domiciliario } from "../../../../services/api/extraprotocolares/domiciliarioService"
import DomiciliarioCard from "./DomiciliarioCard";
import { emptyMotionProps } from "../rowMotion"

interface Props {
    domiciliarios: Domiciliario[];
    page: number;
    readyOnly?: boolean;
}

const DomiciliarioTableBody = ({ domiciliarios, readyOnly }: Props) => {
  if (domiciliarios.length === 0) {
    return (
      <motion.div {...emptyMotionProps} className="flex flex-col items-center justify-center gap-2 px-4 py-14 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <FileSearch className="h-5 w-5" aria-hidden />
        </span>
        <p className="text-sm font-medium text-slate-600">No hay certificados disponibles</p>
        <p className="text-xs text-slate-400">Pruebe con otros filtros de búsqueda.</p>
      </motion.div>
    )
  }

  return (
    <div className="divide-y divide-slate-100">
      {domiciliarios.map((domiciliario, index) => (
        <DomiciliarioCard
          key={domiciliario.id_domiciliario}
          domiciliario={domiciliario}
          readyOnly={readyOnly}
          index={index}
        />
      ))}
    </div>
  )
}

export default DomiciliarioTableBody
