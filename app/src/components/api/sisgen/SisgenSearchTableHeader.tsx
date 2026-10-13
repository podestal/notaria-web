import { useState } from "react"
import { motion } from "framer-motion"
import { SendHorizontal } from "lucide-react"
import type { SisgenSearchHandlers } from "../../../hooks/sisgen/sisgenSearchKeys"
import type { SisgenSearchFilters } from "../../../utils/buildSisgenSearchFilters"
import { buildSisgenSearchFilters } from "../../../utils/buildSisgenSearchFilters"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import useAuthStore from "../../../store/useAuthStore"
import useRefreshLastSisgenSearch from "../../../hooks/sisgen/useRefreshLastSisgenSearch"
import SisgenSendAllPreviewModal from "./SisgenSendAllPreviewModal"
import { SISGEN_TABLE_GRID, sisgenCol } from "./sisgenTableGrid"

interface Props {
  setPage: React.Dispatch<React.SetStateAction<number>>
  sisgenDocs: SISGENDocument[]
  instrumentType: number
  selectedFromDate: Date | undefined
  selectedToDate: Date | undefined
  selectedEstado: number
  page: number
  setSisgenDocs: React.Dispatch<React.SetStateAction<SISGENDocument[]>>
  setItemsCount: React.Dispatch<React.SetStateAction<number>>
  setSearchId: React.Dispatch<React.SetStateAction<string>>
  setNoDocsMessage: React.Dispatch<React.SetStateAction<string>>
  setErrorDisplay: React.Dispatch<React.SetStateAction<string>>
  searchId: string
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  searchHandlers: SisgenSearchHandlers
}

const SisgenSearchTableHeader = ({
  sisgenDocs,
  instrumentType,
  selectedFromDate,
  selectedToDate,
  selectedEstado,
  setErrorDisplay,
}: Props) => {
  const access = useAuthStore((s) => s.access_token) || ""
  const refreshLastSisgenSearch = useRefreshLastSisgenSearch()
  const { setMessage, setShow, setType } = useNotificationsStore()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewFilters, setPreviewFilters] = useState<SisgenSearchFilters | null>(
    null,
  )

  const handleOpenSendAllPreview = () => {
    const built = buildSisgenSearchFilters({
      instrumentType,
      selectedFromDate,
      selectedToDate,
      selectedEstado,
    })

    if (!built.ok) {
      setErrorDisplay(built.error)
      setMessage(built.error)
      setShow(true)
      setType("error")
      return
    }

    setErrorDisplay("")
    setPreviewFilters(built.filters)
    setPreviewOpen(true)
  }

  const handleClosePreview = () => {
    setPreviewOpen(false)
    setPreviewFilters(null)
  }

  return (
    <>
      <div className={`${SISGEN_TABLE_GRID} sticky top-0 z-10 border-b border-slate-200 bg-slate-50/95 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 backdrop-blur`}>
        <p className={sisgenCol.idx}>Nº</p>
        <p className={sisgenCol.kardex}>Nº Kardex</p>
        <p className={sisgenCol.instrumento}>Nº Inst.</p>
        <p className={sisgenCol.fecha}>Fec. escrit.</p>
        <p className={sisgenCol.acto}>Acto</p>
        <p className={sisgenCol.estado}>Estado</p>
        <p className={`${sisgenCol.validacion} leading-tight`}>
          Validación
          <span className="block text-[9px] font-normal normal-case tracking-normal text-slate-400">
            Errores / Obs. / Personas
          </span>
        </p>
        <div className={sisgenCol.action}>
          <motion.button
            type="button"
            whileHover={sisgenDocs.length === 0 ? undefined : { y: -1 }}
            whileTap={sisgenDocs.length === 0 ? undefined : { scale: 0.96 }}
            className="inline-flex w-full max-w-[8.5rem] items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-2 text-[11px] font-semibold normal-case tracking-normal text-white shadow-sm shadow-orange-500/30 transition hover:from-orange-600 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleOpenSendAllPreview}
            disabled={sisgenDocs.length === 0}
          >
            <SendHorizontal className="h-3.5 w-3.5" />
            Enviar Todos
          </motion.button>
        </div>
      </div>

      <SisgenSendAllPreviewModal
        isOpen={previewOpen}
        onClose={handleClosePreview}
        access={access}
        filters={previewFilters}
        onSent={() => refreshLastSisgenSearch()}
      />
    </>
  )
}

export default SisgenSearchTableHeader
