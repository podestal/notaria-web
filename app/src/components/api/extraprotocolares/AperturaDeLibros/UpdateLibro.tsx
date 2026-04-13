
import useUpdateLibro from "../../../../hooks/api/extraprotocolares/aperturaLibros/useUpdateLibro"
import { Libro } from "../../../../services/api/extraprotocolares/librosService"
import PreLibroForm from "./PreLibroForm"

interface Props {
    libro: Libro
    page: number
}

const UpdateLibro = ({ libro, page }: Props) => {

    const updateLibro = useUpdateLibro({ libroId: libro.id, page })

  return (
    <PreLibroForm
        libro={libro}
        updateLibro={updateLibro}
    />
  )
}

export default UpdateLibro