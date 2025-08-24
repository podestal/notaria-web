import { Libro } from "../../../../services/api/extraprotocolares/librosService"
import LibrosCard from "./LibrosCard"

interface Libros {
    libros: Libro[]
    readyOnly?: boolean
}

const LibrosTableBody = ({ libros, readyOnly }: Libros) => {
  return (
    <>
        {libros.length > 0 ? (
            libros.map(libro => (
                <LibrosCard key={libro.id} libro={libro} readyOnly={readyOnly} />
            ))
        ) : (
            <p>No hay libros disponibles</p>
        )}
    </>
  )
}

export default LibrosTableBody