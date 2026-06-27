
import { useState } from "react"
import useProcessDocument from "../../../hooks/sisgen/useProcessDocument"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import useAuthStore from "../../../store/useAuthStore"
import getTitleCase from "../../../utils/getTitleCase"
import TopModal from "../../ui/TopModal"
import SisgenKardexModal from "./SisgenKardexModal"
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
const SisgenSingleCard = ({ sisgenDoc, idx }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { setMessage, setShow, setType } =useNotificationsStore()
    const [loading, setLoading] = useState(false)
    const sendDocument = useProcessDocument()
    const [isOpen, setIsOpen] = useState(false)
    const [isSisgenResponseOpen, setIsSisgenResponseOpen] = useState(false)
    const sisgenLastSubmission = sisgenDoc.sisgen_last_submission
    const sisgenStatus = getSisgenDisplayStatus(sisgenDoc)
    const canSend = canSendSisgenDocument(sisgenDoc)
  
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
    <SisgenKardexModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        idkardex={sisgenDoc.idkardex}
        kardex={sisgenDoc.kardex}
        portal
    />
    <TopModal
        isOpen={isSisgenResponseOpen}
        onClose={() => setIsSisgenResponseOpen(false)}
    >
        <div className="p-5 text-sm max-w-2xl">
            <h3 className="text-base font-semibold mb-4">Ultima respuesta SISGEN</h3>
            {sisgenLastSubmission?.exists ? (
                <SisgenLastSubmissionView
                    documentLabel="Kardex"
                    documentValue={sisgenDoc.kardex}
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

export default SisgenSingleCard
