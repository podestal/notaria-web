import { motion } from "framer-motion"
import { FileSearch } from "lucide-react"
import { Libro } from "../../../../services/api/extraprotocolares/librosService"
import LibrosCard from "./LibrosCard"
import { emptyMotionProps } from "../rowMotion"

interface Libros {
    libros: Libro[]
    readyOnly?: boolean
    page: number
}

const LibrosTableBody = ({ libros, readyOnly, page }: Libros) => {
  if (libros.length === 0) {
    return (
      <motion.div {...emptyMotionProps} className="flex flex-col items-center justify-center gap-2 px-4 py-14 text-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <FileSearch className="h-5 w-5" aria-hidden />
        </span>
        <p className="text-sm font-medium text-slate-600">No hay libros disponibles</p>
        <p className="text-xs text-slate-400">Pruebe con otros filtros de búsqueda.</p>
      </motion.div>
    )
  }

  return (
    <div className="divide-y divide-slate-100">
      {libros.map((libro, index) => (
        <LibrosCard key={libro.id} libro={libro} readyOnly={readyOnly} page={page} index={index} />
      ))}
    </div>
  )
}

export default LibrosTableBody
