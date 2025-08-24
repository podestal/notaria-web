import { Libro } from "../../../../services/api/extraprotocolares/librosService"
import LibrosTableBody from "./LibrosTableBody"
import LibrosTableHeader from "./LibrosTableHeader"

interface Libros {
    libros: Libro[]
    readyOnly?: boolean
}

const LibrosTable = ({ libros, readyOnly }: Libros) => {
  return (
    <>
        <LibrosTableHeader />
        <LibrosTableBody libros={libros} readyOnly={readyOnly} />
    </>
  )
}

export default LibrosTable