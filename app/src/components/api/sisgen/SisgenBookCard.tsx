import { useState } from "react"
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import getTitleCase from "../../../utils/getTitleCase"
import TopModal from "../../ui/TopModal"
import ArchivoPdtPreLibroForm from "../reportes/archivosPdt/PDTLibros/ArchivoPdtPreLibroForm"
import useGetLibroByNumlibro from "../../../hooks/api/extraprotocolares/aperturaLibros/useGetLibroByNumlibro"
import useAuthStore from "../../../store/useAuthStore"
import useGetTipoLibros from "../../../hooks/api/extraprotocolares/aperturaLibros/useGetTipoLibros"
import {
    canSendSisgenDocument,
    getSisgenDisplayStatus,
} from "../../../utils/sisgenSendState"
import SisgenValidationCountsCell from "./SisgenValidationCountsCell"
import SisgenLastSubmissionView from "./SisgenLastSubmissionView"

interface Props {
    sisgenDoc: SISGENDocument
    idx: number
}

const SisgenBookCard = ({ sisgenDoc, idx }: Props) => {

    const access = useAuthStore( s => s.access_token) || ''

    const [loading, setLoading] = useState(false)
    const [showLibro, setShowLibro] = useState(false)
    const [isSisgenResponseOpen, setIsSisgenResponseOpen] = useState(false)
    const sisgenLastSubmission = sisgenDoc.sisgen_last_submission
    const sisgenStatus = getSisgenDisplayStatus(sisgenDoc)
    const canSend = canSendSisgenDocument(sisgenDoc)

  const handleSend = () => {
    setLoading(true)
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
        <div className="flex flex-col gap-1">
          <p>{getTitleCase(sisgenStatus)}</p>
          {sisgenLastSubmission?.exists && (
            <button
              type="button"
              onClick={() => setIsSisgenResponseOpen(true)}
              className="text-[10px] bg-indigo-600 text-white px-2 py-1 rounded-md hover:bg-indigo-700 transition-colors w-fit"
            >
              Ver respuesta SISGEN
            </button>
          )}
        </div>
        <SisgenValidationCountsCell doc={sisgenDoc} />
        {canSend 
        ? 
        <button 
          onClick={handleSend}
          className="bg-blue-500 w-[100px] h-[28px] text-white px-4 py-1 rounded-md cursor-pointer hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Enviando...' : sisgenLastSubmission?.exists ? 'Reenviar' : 'Enviar'}
        </button> 
        :
        <button 
        type="button"
        className="bg-green-500 w-[100px] h-[28px] text-white px-4 py-1 rounded-md cursor-not-allowed "
        disabled
      >
        Guardado
      </button>
        }
    </div>
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
    <TopModal isOpen={isSisgenResponseOpen} onClose={() => setIsSisgenResponseOpen(false)}>
        <div className="p-5 text-sm max-w-2xl">
            <h3 className="text-base font-semibold mb-4">Ultima respuesta SISGEN</h3>
            {sisgenLastSubmission?.exists ? (
                <SisgenLastSubmissionView
                    documentLabel="Cronologico"
                    documentValue={sisgenDoc.libro}
                    submission={sisgenLastSubmission}
                />
            ) : (
                <p>Este documento aun no tiene respuesta SISGEN.</p>
            )}
        </div>
    </TopModal>
    </>
  )
}

export default SisgenBookCard
