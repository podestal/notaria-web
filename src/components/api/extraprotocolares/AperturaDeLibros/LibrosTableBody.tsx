import { Libro } from "../../../../services/api/extraprotocolares/librosService"
import LibrosCard from "./LibrosCard"

interface Libros {
    libros: Libro[]
}

const LibrosTableBody = ({ libros }: Libros) => {
  return (
    <>
        {libros.length > 0 ? (
            libros.map(libro => (
                <LibrosCard key={libro.id} libro={libro} />
            ))
        ) : (
            <p>No hay libros disponibles</p>
        )}
    </>
  )
}

export default LibrosTableBody