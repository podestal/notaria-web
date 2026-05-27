
import { useState } from "react"
import useProcessDocument from "../../../hooks/sisgen/useProcessDocument"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import useAuthStore from "../../../store/useAuthStore"
import getTitleCase from "../../../utils/getTitleCase"
import { ChevronDownIcon, ChevronUpIcon, AlertTriangleIcon, UserIcon } from "lucide-react"
import TopModal from "../../ui/TopModal"
import PreKardexForm from "../reportes/registrosUif/PreKardexForm"

interface Props {
    sisgenDoc: SISGENDocument
    idx: number
}
const SisgenSingleCard = ({ sisgenDoc, idx }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { setMessage, setShow, setType } =useNotificationsStore()
    const [loading, setLoading] = useState(false)
    const sendDocument = useProcessDocument()
    const [showErrors, setShowErrors] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [isSisgenResponseOpen, setIsSisgenResponseOpen] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)
    const sisgenLastSubmission = sisgenDoc.sisgen_last_submission
    const sisgenErrors = sisgenLastSubmission?.errors?.length
      ? sisgenLastSubmission.errors
      : (sisgenDoc.errores || [])
    const sisgenStatus = sisgenLastSubmission?.document_status || sisgenDoc?.estado_sisgen || ''
    const alreadySent = sisgenLastSubmission?.exists || sisgenDoc.estado_sisgen === "Enviado"
  
    const handleSend = () => {
      setLoading(true)
  
      sendDocument.mutate({
  
        access,
        data: {
          documents: [
            {
              kardex: sisgenDoc.kardex,
              idkardex: sisgenDoc.idkardex.toString()
            }
          ],
          all: 0
        }
      }, {
        onSuccess: () => {
          setMessage('Documento enviado correctamente')
          setShow(true)
          setType('success')
          setIsDisabled(true)
        },
        onError: () => {
          setMessage('Error al enviar el documento')
          setShow(true)
          setType('error')
        },
        onSettled: () => {
          setLoading(false)
        }
      })
    }

  return (
    <>
    <div>
    <div 
        key={sisgenDoc.idkardex} 
        className="grid grid-cols-7 gap-4 p-2 border-b text-xs align-middle"
    >
        <p>{idx}</p>
        <p 
            
            className="col-span-2 text-blue-500 cursor-pointer hover:text-blue-700"
            onClick={() => setIsOpen(true)}
        >
            {sisgenDoc?.kardex || ''}
        </p>
        <p>{getTitleCase(sisgenDoc?.contrato || '')}</p>
        <div className="flex flex-col gap-1">
          <p>{sisgenStatus}</p>
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
                {sisgenErrors.map((error, idx) => (
                    <div key={idx + 'error'} className="flex items-center gap-2">
                        <AlertTriangleIcon className="w-4 h-4 text-red-500" />
                        <p >{error}</p>
                    </div>
                ))}
                </>
                <>
                    {sisgenDoc.observaciones.map((observacion, idx) => (
                        <div key={idx + 'observacion'} className="flex items-center gap-2">
                            <AlertTriangleIcon className="w-4 h-4 text-amber-500" />
                            <p >{observacion}</p>
                        </div>
                    ))}
                </>
                <>
                    {sisgenDoc.personas.map((persona, idx) => (
                        <div key={idx + 'persona'} className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-blue-500" />
                            <p >{persona}</p>
                        </div>
                    ))}
                </>
            </div>
            <div>
            {sisgenDoc.uif_validation.has_errors && <h3 className="font-semibold mb-2">Errores Uif</h3>}
            <>
                {sisgenDoc.uif_validation.errors.map((error, idx) => (
                    <div key={idx + 'error'} className="flex items-center gap-2">
                        <AlertTriangleIcon className="w-4 h-4 text-red-500" />
                        <p className="text-xs">{error.error_description}</p>
                    </div>
                ))}
                {sisgenDoc.uif_validation.observations.map((observation, idx) => (
                    <div key={idx + 'observation'} className="flex items-center gap-2">
                        <AlertTriangleIcon className="w-4 h-4 text-amber-500" />
                        <p className="text-xs">{observation}</p>
                    </div>
                ))}
            </>
            </div>
            <div>
                
                {(sisgenDoc.idtipkar === 1 || sisgenDoc.idtipkar === 3 || sisgenDoc.idtipkar === 4) && 
                <>
                {sisgenDoc.pdt_validation.has_errors && <h3 className="font-semibold mb-2">Errores Pdt</h3>}
                {sisgenDoc.pdt_validation.errors.map((error, idx) => (
                    <div key={idx + 'error'} className="flex items-center gap-2">
                        <AlertTriangleIcon className="w-4 h-4 text-red-500" />
                        <p className="text-xs">{error}</p>
                    </div>
                ))}
                </>}
            </div>
            

        </div>
    )}
    </div>
    <TopModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
    >
        <PreKardexForm
            isOpen={isOpen}
            kardexId={sisgenDoc.idkardex}
        />
    </TopModal>
    <TopModal
        isOpen={isSisgenResponseOpen}
        onClose={() => setIsSisgenResponseOpen(false)}
    >
        <div className="p-5 text-sm max-w-2xl">
            <h3 className="text-base font-semibold mb-4">Ultima respuesta SISGEN</h3>
            {sisgenLastSubmission?.exists ? (
                <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
                      <p><strong>Kardex:</strong> {sisgenDoc.kardex}</p>
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

export default SisgenSingleCard