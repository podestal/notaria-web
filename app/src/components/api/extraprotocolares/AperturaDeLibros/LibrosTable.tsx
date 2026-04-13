import { Libro } from "../../../../services/api/extraprotocolares/librosService"
import LibrosTableBody from "./LibrosTableBody"
import LibrosTableHeader from "./LibrosTableHeader"

interface Libros {
    libros: Libro[]
    readyOnly?: boolean
    page: number
}

const LibrosTable = ({ libros, readyOnly, page }: Libros) => {
  return (
    <>
        <LibrosTableHeader />
        <LibrosTableBody libros={libros} readyOnly={readyOnly} page={page} />
    </>
  )
}

export default LibrosTable