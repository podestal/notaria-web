import useUpdateLibro from "../../../../../hooks/api/extraprotocolares/aperturaLibros/useUpdateLibro"
import { Libro } from "../../../../../services/api/extraprotocolares/librosService"
import { TipoLibro } from "../../../../../services/api/extraprotocolares/tipoLibroService"
import LibroForm from "../../../extraprotocolares/AperturaDeLibros/LibroForm"

interface Props {
    libro: Libro
    tipoLibros: TipoLibro[]
}

const ArchivoPdtPreLibroForm = ({ libro, tipoLibros }: Props) => {

    const updateLibro = useUpdateLibro({libroId: libro.id, page: 1})

  return (
    <LibroForm 
        libro={libro}
        tipoLibros={tipoLibros}
        updateLibro={updateLibro}
    />
  )
}

export default ArchivoPdtPreLibroForm