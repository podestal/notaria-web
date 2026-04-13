import { useState } from "react"
import { LibroPdt } from "../../../../../services/api/extraprotocolares/librosService"
import TopModal from "../../../../ui/TopModal"
import useAuthStore from "../../../../../store/useAuthStore"
import useGetLibroByNumlibro from "../../../../../hooks/api/extraprotocolares/aperturaLibros/useGetLibroByNumlibro"
import useGetTipoLibros from "../../../../../hooks/api/extraprotocolares/aperturaLibros/useGetTipoLibros"
import ArchivoPdtPreLibroForm from "./ArchivoPdtPreLibroForm"

interface Props {
    error: LibroPdt
}

const ArchivoPdtLibrosCard = ({ error }: Props) => {
    const access = useAuthStore( s => s.access_token) || ''
    const [open, setOpen] = useState(false)
  return (
    <>
    <div className="grid grid-cols-2 gap-4 justify-center items-center text-center text-xs p-2 my-4 mx-6 text-black">
        <p 
            onClick={() => setOpen(true)}
            className="text-blue-500 hover:text-blue-700 cursor-pointer transition-all duration-300"
        >
            {error.bookNumber}
        </p>
        <p>{error.errorItem}</p>
    </div>
    <TopModal isOpen={open} onClose={() => setOpen(false)}>
        {(() => {
            const { data: libro, isLoading: isLoadingLibro, isError: isErrorLibro, isSuccess: isSuccessLibro } = useGetLibroByNumlibro({ access, numlibro: error.bookNumber })

            const { data: tipoLibros, isLoading: isLoadingTipoLibros, isError: isErrorTipoLibros, isSuccess: isSuccessTipoLibros } = useGetTipoLibros({access})

            if (isLoadingLibro || isLoadingTipoLibros) return <div className="flex justify-center items-center h-full">Cargando...</div>
            if (isErrorLibro || isErrorTipoLibros) return <div className="flex justify-center items-center h-full">Error al cargar el libro</div>
            if (isSuccessLibro && isSuccessTipoLibros) return (
                <ArchivoPdtPreLibroForm libro={libro} tipoLibros={tipoLibros} />
            )
        })()}
    </TopModal>
    </>
  )
}

export default ArchivoPdtLibrosCard