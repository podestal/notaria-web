
import { Libro } from "../../../../services/api/extraprotocolares/librosService"
import PreLibroForm from "./PreLibroForm"

interface Props {
    libro: Libro
}

const UpdateLibro = ({ libro }: Props) => {
  return (
    <PreLibroForm
        libro={libro}
    />
  )
}

export default UpdateLibro