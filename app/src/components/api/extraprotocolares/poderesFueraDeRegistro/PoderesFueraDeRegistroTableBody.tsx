import { motion } from "framer-motion"
import { FileSearch } from "lucide-react"
import { IngresoPoderesPage } from "../../../../services/api/extraprotocolares/ingresoPoderes"
import PoderesFueraDeRegistroCard from "./PoderesFueraDeRegistroCard"
import { emptyMotionProps } from "../rowMotion"

interface Props {
    poderes: IngresoPoderesPage | undefined
    page: number
    readyOnly?: boolean
}

const PoderesFueraDeRegistroTableBody = ({ poderes, page, readyOnly }: Props) => {
  if (!poderes || poderes.results.length === 0) {
    return (
      <motion.div {...emptyMotionProps} className="flex flex-col items-center justify-center gap-2 px-4 py-14 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <FileSearch className="h-5 w-5" aria-hidden />
        </span>
        <p className="text-sm font-medium text-slate-600">No hay registros</p>
        <p className="text-xs text-slate-400">Pruebe con otros filtros de búsqueda.</p>
      </motion.div>
    )
  }

  return (
    <div className="divide-y divide-slate-100">
      {poderes.results.map((poder, index) => (
        <PoderesFueraDeRegistroCard
          key={poder.id_poder}
          poder={poder}
          page={page}
          readyOnly={readyOnly}
          index={index}
        />
      ))}
    </div>
  )
}

export default PoderesFueraDeRegistroTableBody
