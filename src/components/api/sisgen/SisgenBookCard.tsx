import { useState } from "react"
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import getTitleCase from "../../../utils/getTitleCase"
import { AlertTriangleIcon, ChevronUpIcon, ChevronDownIcon, UserIcon } from "lucide-react"
import TopModal from "../../ui/TopModal"
import ArchivoPdtPreLibroForm from "../reportes/archivosPdt/PDTLibros/ArchivoPdtPreLibroForm"
import useGetLibroByNumlibro from "../../../hooks/api/extraprotocolares/aperturaLibros/useGetLibroByNumlibro"
import useAuthStore from "../../../store/useAuthStore"
import useGetTipoLibros from "../../../hooks/api/extraprotocolares/aperturaLibros/useGetTipoLibros"

interface Props {
    sisgenDoc: SISGENDocument
    idx: number
}

const SisgenBookCard = ({ sisgenDoc, idx }: Props) => {

    const access = useAuthStore( s => s.access_token) || ''

    const [loading, setLoading] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const [showErrors, setShowErrors] = useState(false)
    const [showLibro, setShowLibro] = useState(false)

  const handleSend = () => {
    setLoading(true)
    setIsDisabled(true)
  }
  return (
    <>
      <div className="grid grid-cols-9 gap-4 p-2 border-b text-xs align-middle">
        <p>{idx}</p>
        <p 
            onClick={() => setShowLibro(true)}
            className="text-blue-500 cursor-pointer hover:text-blue-700 transition-all duration-300"
        >
            {sisgenDoc.libro}
        </p>
        <p>{sisgenDoc.tipoPersona === 'J' ? 'Jurídica' : sisgenDoc.tipoPersona === 'N' ? 'Natural' : ''}</p>
        <p>{sisgenDoc.ruc}</p>
        <p>{getTitleCase(sisgenDoc.empresa || '')}</p>
        <p>{getTitleCase(sisgenDoc.descripcionTipoLibro || '')}</p>
        <p>{getTitleCase(sisgenDoc.estadoSisgen || '')}</p>
        {showErrors ? <ChevronUpIcon 
            className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700" 
            onClick={() => setShowErrors(!showErrors)}
        /> : <ChevronDownIcon 
            className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700" 
            onClick={() => setShowErrors(!showErrors)}
        />}
        {sisgenDoc.estadoSisgen?.toLocaleLowerCase() !== "enviado" 
        ? 
        <button 
          onClick={handleSend}
          className="bg-blue-500 w-[100px] h-[28px] text-white px-4 py-1 rounded-md cursor-pointer hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || isDisabled}
        >
          {loading ? 'Enviando...' : 'Enviar'}
        </button> 
        :
        <button 
        // onClick={handleSend}
        className="bg-green-500 w-[100px] h-[28px] text-white px-4 py-1 rounded-md cursor-not-allowed "
        // disabled
      >
        Guardado
      </button>
        }
    </div>
    {showErrors && (
        <div className="p-4 text-xs flex flex-col gap-2">
            <div>
                <h3 className="font-semibold mb-2">Errores Sisgen</h3>
                <>
                {sisgenDoc.errores?.map((error, idx) => (
                    <div key={idx + 'error'} className="flex items-center gap-2">
                        <AlertTriangleIcon className="w-4 h-4 text-red-500" />
                        <p >{error}</p>
                    </div>
                ))}
                </>
                <>
                    {sisgenDoc.observaciones?.map((observacion, idx) => (
                        <div key={idx + 'observacion'} className="flex items-center gap-2">
                            <AlertTriangleIcon className="w-4 h-4 text-amber-500" />
                            <p >{observacion}</p>
                        </div>
                    ))}
                </>
                <>
                    {sisgenDoc.personas?.map((persona, idx) => (
                        <div key={idx + 'persona'} className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-blue-500" />
                            <p >{persona}</p>
                        </div>
                    ))}
                </>
            </div>
            <div>
            <h3 className="font-semibold mb-2">Errores Pdt</h3>
            <>
                {sisgenDoc.pdt_validation.errors.map((error, idx) => (
                    <div key={idx + 'error'} className="flex items-center gap-2">
                        <AlertTriangleIcon className="w-4 h-4 text-red-500" />
                        <p className="text-xs">{error}</p>
                    </div>
                ))}
            </>
            </div>

        </div>
    )}
        <TopModal isOpen={showLibro} onClose={() => setShowLibro(false)}>
        {(() => {
            const numlibro = sisgenDoc.libro.split('-')[0]
            const { data: libro, isLoading: isLoadingLibro, isError: isErrorLibro, isSuccess: isSuccessLibro } = useGetLibroByNumlibro({ access, numlibro })

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

export default SisgenBookCard