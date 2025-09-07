import { Libro } from "../../../../services/api/extraprotocolares/librosService"
import LibrosCard from "./LibrosCard"

interface Libros {
    libros: Libro[]
    readyOnly?: boolean
    page: number
}

const LibrosTableBody = ({ libros, readyOnly, page }: Libros) => {
  return (
    <>
        {libros.length > 0 ? (
            libros.map(libro => (
                <LibrosCard key={libro.id} libro={libro} readyOnly={readyOnly} page={page} />
            ))
        ) : (
            <p className="text-center text-xs my-4 py-4">No hay libros disponibles</p>
        )}
    </>
  )
}

export default LibrosTableBody