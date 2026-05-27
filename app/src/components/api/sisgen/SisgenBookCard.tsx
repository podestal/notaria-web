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
    const [isSisgenResponseOpen, setIsSisgenResponseOpen] = useState(false)
    const sisgenLastSubmission = sisgenDoc.sisgen_last_submission
    const sisgenErrors = sisgenLastSubmission?.errors?.length
      ? sisgenLastSubmission.errors
      : (sisgenDoc.errores || [])
    const sisgenStatus = sisgenLastSubmission?.document_status || sisgenDoc.estadoSisgen || ''
    const alreadySent = sisgenLastSubmission?.exists || sisgenDoc.estadoSisgen?.toLocaleLowerCase() === "enviado"

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
        {showErrors ? <ChevronUpIcon 
            className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700" 
            onClick={() => setShowErrors(!showErrors)}
        /> : <ChevronDownIcon 
            className="w-4 h-4 cursor-pointer text-gray-500 hover:text-gray-700" 
            onClick={() => setShowErrors(!showErrors)}
        />}
        {!alreadySent 
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
                {sisgenErrors?.map((error, idx) => (
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
    <TopModal isOpen={isSisgenResponseOpen} onClose={() => setIsSisgenResponseOpen(false)}>
        <div className="p-5 text-sm max-w-2xl">
            <h3 className="text-base font-semibold mb-4">Ultima respuesta SISGEN</h3>
            {sisgenLastSubmission?.exists ? (
                <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
                      <p><strong>Cronologico:</strong> {sisgenDoc.libro}</p>
                      <p className="mt-2">
                        <strong>Estado documento:</strong>{" "}
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                          {sisgenLastSubmission.document_status || "-"}
                        </span>
                      </p>
                      <p className="mt-2"><strong>SOAP status:</strong> {sisgenLastSubmission.soap_return_status || "-"}</p>
                    </div>
                    <div>
                        <p className="font-semibold mb-2">Errores SISGEN</p>
                        {sisgenLastSubmission.errors?.length ? (
                            <div className="space-y-2">
                              {sisgenLastSubmission.errors.map((error, idx) => (
                                  <div key={`${error}-${idx}`} className="bg-red-50 border border-red-200 text-red-700 rounded-md px-3 py-2">
                                    {error}
                                  </div>
                              ))}
                            </div>
                        ) : (
                            <p className="text-slate-600">Sin errores.</p>
                        )}
                    </div>
                </div>
            ) : (
                <p>Este documento aun no tiene respuesta SISGEN.</p>
            )}
        </div>
    </TopModal>
    </>
  )
}

export default SisgenBookCard