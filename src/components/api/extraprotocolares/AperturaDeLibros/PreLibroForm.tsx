import useGetTipoLibros from "../../../../hooks/api/extraprotocolares/aperturaLibros/useGetTipoLibros"
import { Libro } from "../../../../services/api/extraprotocolares/librosService"
import useAuthStore from "../../../../store/useAuthStore"
import LibroForm from "./LibroForm"

interface Props {
    libro?: Libro
}

const PreLibroForm = ({ libro }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { data: tipoLibros, isLoading, isError, error, isSuccess } = useGetTipoLibros({ access })

    if (isLoading) return <p className="text-center text-xs my-4 animate-pulse font-semibold">Cargando...</p>

    if (isError) return <p className="text-center text-xs my-4 animate-pulse font-semibold">Error {error?.message}</p>

    if (isSuccess) {

  return (
    <>
        <>{console.log(tipoLibros)}</>
        <LibroForm 
            libro={libro}
        />
    </>
  )
}
}

export default PreLibroForm