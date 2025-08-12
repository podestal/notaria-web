
import { Libro } from "../../../../services/api/extraprotocolares/librosService"
import LibroForm from "./LibroForm"

interface Props {
    libro: Libro
}

const UpdateLibro = ({ libro }: Props) => {
  return (
    <LibroForm 
        libro={libro}
    />
  )
}

export default UpdateLibro