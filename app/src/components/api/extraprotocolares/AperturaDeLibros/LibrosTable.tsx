import { Libro } from "../../../../services/api/extraprotocolares/librosService"
import ExtraTableShell from "../ExtraTableShell"
import LibrosTableBody from "./LibrosTableBody"
import LibrosTableHeader from "./LibrosTableHeader"

interface Libros {
    libros: Libro[]
    readyOnly?: boolean
    page: number
    totalCount?: number
}

const LibrosTable = ({ libros, readyOnly, page, totalCount }: Libros) => {
  return (
    <ExtraTableShell
      count={totalCount ?? libros.length}
      label="libros encontrados"
      hint={readyOnly ? undefined : "Haga clic en una fila para abrir el libro"}
      minWidth="1080px"
    >
      <LibrosTableHeader />
      <LibrosTableBody libros={libros} readyOnly={readyOnly} page={page} />
    </ExtraTableShell>
  )
}

export default LibrosTable
