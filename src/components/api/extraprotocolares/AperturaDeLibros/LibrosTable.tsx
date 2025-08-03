import { Libro } from "../../../../services/api/extraprotocolares/librosService"
import LibrosTableBody from "./LibrosTableBody"
import LibrosTableHeader from "./LibrosTableHeader"

interface Libros {
    libros: Libro[]
}

const LibrosTable = ({ libros }: Libros) => {
  return (
    <>
        <LibrosTableHeader />
        <LibrosTableBody libros={libros} />
    </>
  )
}

export default LibrosTable