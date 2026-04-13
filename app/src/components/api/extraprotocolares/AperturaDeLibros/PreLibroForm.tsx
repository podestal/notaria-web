import { UseMutationResult } from "@tanstack/react-query"
import useGetTipoLibros from "../../../../hooks/api/extraprotocolares/aperturaLibros/useGetTipoLibros"
import { Libro } from "../../../../services/api/extraprotocolares/librosService"
import useAuthStore from "../../../../store/useAuthStore"
import LibroForm from "./LibroForm"
import { CreateLibroData } from "../../../../hooks/api/extraprotocolares/aperturaLibros/useCreateLibro"

interface Props {
    libro?: Libro
    createLibro?: UseMutationResult<Libro, Error, CreateLibroData>
    updateLibro?: UseMutationResult<Libro, Error, UpdateLibroData>
}

const PreLibroForm = ({ 
  libro, 
  createLibro, 
  updateLibro 
}: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { data: tipoLibros, isLoading, isError, error, isSuccess } = useGetTipoLibros({ access })

    if (isLoading) return <p className="text-center text-xs my-4 animate-pulse font-semibold">Cargando...</p>

    if (isError) return <p className="text-center text-xs my-4 animate-pulse font-semibold">Error {error?.message}</p>

    if (isSuccess) {

  return (
    <>
        <LibroForm 
            libro={libro}
            tipoLibros={tipoLibros}
            createLibro={createLibro}
            updateLibro={updateLibro}
        />
    </>
  )
}
}

export default PreLibroForm