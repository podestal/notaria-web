import { Libro } from "../../../../services/api/extraprotocolares/librosService"

interface Libros {
    libros: Libro[]
}

const LibrosTableBody = ({ libros }: Libros) => {
  return (
    <div>
        <>{console.log(libros)}</>
    </div>
  )
}

export default LibrosTableBody