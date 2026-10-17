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
import SisgenStatusBadge from "./SisgenStatusBadge"
import { SISGEN_BOOKS_GRID_COLUMNS } from "./SisgenBooksTableHeader"
import { motion } from "framer-motion"
import { CheckCircle2, Loader2, MessageSquareText, RotateCw, Send } from "lucide-react"

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
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: Math.min(idx, 20) * 0.025, ease: "easeOut" }}
        className="grid items-center gap-3 px-4 py-3 text-xs text-slate-700 transition-colors hover:bg-slate-50"
        style={{ gridTemplateColumns: SISGEN_BOOKS_GRID_COLUMNS }}
      >
        <p className="text-center tabular-nums text-slate-400">{idx}</p>
        <div className="min-w-0">
            <button
                type="button"
                onClick={() => setShowLibro(true)}
                className="max-w-full truncate rounded-md bg-sky-50 px-2 py-1 font-mono text-[11px] font-semibold text-sky-700 ring-1 ring-sky-100 transition hover:bg-sky-100 hover:ring-sky-200"
            >
                {sisgenDoc.libro}
            </button>
        </div>
        <div>
            {sisgenDoc.tipoPersona === 'J' || sisgenDoc.tipoPersona === 'N' ? (
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${
                    sisgenDoc.tipoPersona === 'J'
                        ? 'bg-violet-50 text-violet-700 ring-violet-200'
                        : 'bg-teal-50 text-teal-700 ring-teal-200'
                }`}>
                    {sisgenDoc.tipoPersona === 'J' ? 'Jurídica' : 'Natural'}
                </span>
            ) : <span className="text-slate-300">—</span>}
        </div>
        <p className="font-mono tabular-nums text-slate-600">{sisgenDoc.ruc || <span className="text-slate-300">—</span>}</p>
        <p className="font-medium text-slate-800">{getTitleCase(sisgenDoc.empresa || '')}</p>
        <p>{getTitleCase(sisgenDoc.descripcionTipoLibro || '')}</p>
        <div className="flex flex-col gap-1.5">
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
        <SisgenValidationCountsCell doc={sisgenDoc} />
        <div className="flex justify-center">
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
        <TopModal isOpen={showLibro} onClose={() => setShowLibro(false)} portal>
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
    <TopModal isOpen={isSisgenResponseOpen} onClose={() => setIsSisgenResponseOpen(false)} portal>
        <div className="max-w-2xl p-5 text-sm text-slate-700">
            <h3 className="mb-4 text-base font-semibold text-slate-800">Ultima respuesta SISGEN</h3>
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
