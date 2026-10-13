
import { useState } from "react"
import useProcessDocument from "../../../hooks/sisgen/useProcessDocument"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import useAuthStore from "../../../store/useAuthStore"
import getTitleCase from "../../../utils/getTitleCase"
import { formatLocalDate, toDateInputValue } from "../../../utils/formatLocalDate"
import TopModal from "../../ui/TopModal"
import SisgenKardexModal from "./SisgenKardexModal"
import {
    canSendSisgenDocument,
    getSisgenDisplayStatus,
} from "../../../utils/sisgenSendState"
import SisgenValidationCountsCell from "./SisgenValidationCountsCell"
import SisgenLastSubmissionView from "./SisgenLastSubmissionView"
import { SISGEN_TABLE_GRID, sisgenCol } from "./sisgenTableGrid"
import SisgenStatusBadge from "./SisgenStatusBadge"
import { motion } from "framer-motion"
import { CheckCircle2, Loader2, MessageSquareText, RotateCw, Send } from "lucide-react"

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
    const fechaRaw = sisgenDoc.fecha_escritura || ""
    const fechaLabel = fechaRaw
        ? formatLocalDate(toDateInputValue(fechaRaw) || fechaRaw)
        : "—"
  
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
        }
      }, {
        onSuccess: (job) => {
          if (job.status === "failed") {
            setMessage(job.failure_message || "Error al enviar el documento")
            setShow(true)
            setType("error")
            return
          }

          const result = job.result
          if (result && result.error !== 0) {
            setMessage(result.messageDescription || result.message || "Error al enviar el documento")
            setShow(true)
            setType("error")
            return
          }

          const fallidos = result?.fallidos ?? 0
          if (fallidos > 0) {
            setMessage(`Envío con errores: ${fallidos} fallido(s)`)
            setShow(true)
            setType("error")
            return
          }

          setMessage("Documento enviado correctamente")
          setShow(true)
          setType("success")
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
    <motion.div 
        key={sisgenDoc.idkardex} 
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: Math.min(idx, 20) * 0.025, ease: "easeOut" }}
        className={`${SISGEN_TABLE_GRID} py-3 text-xs text-slate-700 transition-colors hover:bg-slate-50`}
    >
        <p className={`${sisgenCol.idx} tabular-nums text-slate-400`}>{idx}</p>
        <div className={sisgenCol.kardex}>
            <button
                type="button"
                className="max-w-full truncate rounded-md bg-sky-50 px-2 py-1 font-mono text-[11px] font-semibold text-sky-700 ring-1 ring-sky-100 transition hover:bg-sky-100 hover:ring-sky-200"
                title={sisgenDoc?.kardex || ''}
                onClick={() => setIsOpen(true)}
            >
                {sisgenDoc?.kardex || ''}
            </button>
        </div>
        <p className={`${sisgenCol.instrumento} font-mono tabular-nums text-slate-800`}>
            {sisgenDoc?.numero_instrumento || sisgenDoc?.numinstrmento || <span className="text-slate-300">—</span>}
        </p>
        <p className={`${sisgenCol.fecha} tabular-nums text-slate-600`}>{fechaLabel}</p>
        <p className={sisgenCol.acto} title={sisgenDoc?.contrato || ''}>
            {getTitleCase(sisgenDoc?.contrato || '')}
        </p>
        <div className={`${sisgenCol.estado} flex flex-col gap-1.5`}>
          <SisgenStatusBadge status={sisgenStatus} />
          {sisgenLastSubmission?.exists && (
            <button
              type="button"
              onClick={() => setIsSisgenResponseOpen(true)}
              className="inline-flex w-fit items-center gap-1 text-[10px] font-semibold text-indigo-600 transition hover:text-indigo-800"
            >
              <MessageSquareText className="h-3 w-3" />
              Ver respuesta SISGEN
            </button>
          )}
        </div>
        <div className={sisgenCol.validacion}>
          <SisgenValidationCountsCell doc={sisgenDoc} />
        </div>
        <div className={sisgenCol.action}>
        {canSend 
        ? 
        <motion.button 
          onClick={handleSend}
          whileHover={loading ? undefined : { y: -1 }}
          whileTap={loading ? undefined : { scale: 0.95 }}
          className="inline-flex h-8 w-full max-w-[7rem] items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-2 text-[11px] font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading
            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
            : sisgenLastSubmission?.exists ? <RotateCw className="h-3.5 w-3.5" /> : <Send className="h-3.5 w-3.5" />}
          {loading ? 'Enviando...' : sisgenLastSubmission?.exists ? 'Reenviar' : 'Enviar'}
        </motion.button> 
        :
        <span className="inline-flex h-8 w-full max-w-[7rem] items-center justify-center gap-1.5 rounded-lg bg-emerald-50 px-2 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Guardado
        </span>
        }
        </div>
    </motion.div>
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
        portal
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
