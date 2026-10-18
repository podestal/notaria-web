import { motion } from "framer-motion"
import { Libro } from "../../../../services/api/extraprotocolares/librosService"
import LibrosCard from "./LibrosCard"
import { emptyMotionProps } from "../rowMotion"

interface Libros {
    libros: Libro[]
    readyOnly?: boolean
    page: number
}

const LibrosTableBody = ({ libros, readyOnly, page }: Libros) => {
  return (
    <>
        {libros.length > 0 ? (
            libros.map((libro, index) => (
                <LibrosCard key={libro.id} libro={libro} readyOnly={readyOnly} page={page} index={index} />
            ))
        ) : (
            <motion.p {...emptyMotionProps} className="text-center text-xs my-4 py-4 text-slate-500">No hay libros disponibles</motion.p>
        )}
    </>
  )
}

export default LibrosTableBody