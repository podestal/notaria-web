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
          <style>{`
            @keyframes sisgen-send-all-shine {
              0% { transform: translateX(-140%) skewX(-18deg); opacity: 0; }
              25% { opacity: 0.85; }
              55% { opacity: 0.55; }
              100% { transform: translateX(220%) skewX(-18deg); opacity: 0; }
            }
            @keyframes sisgen-send-all-glow {
              0%, 100% { box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.35), 0 6px 16px rgba(249, 115, 22, 0.28); }
              50% { box-shadow: 0 0 0 6px rgba(249, 115, 22, 0), 0 8px 22px rgba(245, 158, 11, 0.4); }
            }
            @keyframes sisgen-send-all-icon {
              0%, 100% { transform: translateX(0); }
              50% { transform: translateX(2px); }
            }
            .sisgen-send-all-btn {
              animation: sisgen-send-all-glow 2.4s ease-in-out infinite;
            }
            .sisgen-send-all-btn .sisgen-send-all-shine {
              animation: sisgen-send-all-shine 2.8s ease-in-out infinite;
            }
            .sisgen-send-all-btn .sisgen-send-all-icon {
              animation: sisgen-send-all-icon 1.6s ease-in-out infinite;
            }
            .sisgen-send-all-btn:disabled {
              animation: none;
              box-shadow: none;
            }
            .sisgen-send-all-btn:disabled .sisgen-send-all-shine,
            .sisgen-send-all-btn:disabled .sisgen-send-all-icon {
              animation: none;
            }
            @media (prefers-reduced-motion: reduce) {
              .sisgen-send-all-btn,
              .sisgen-send-all-btn .sisgen-send-all-shine,
              .sisgen-send-all-btn .sisgen-send-all-icon {
                animation: none;
              }
            }
          `}</style>
          <motion.button
            type="button"
            whileHover={sisgenDocs.length === 0 ? undefined : { y: -2, scale: 1.03 }}
            whileTap={sisgenDocs.length === 0 ? undefined : { scale: 0.96 }}
            className="sisgen-send-all-btn relative inline-flex w-full max-w-[8.5rem] items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500 bg-[length:200%_100%] px-3 py-2 text-[11px] font-semibold normal-case tracking-normal text-white transition hover:from-orange-600 hover:via-amber-500 hover:to-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={handleOpenSendAllPreview}
            disabled={sisgenDocs.length === 0}
          >
            <span
              className="sisgen-send-all-shine pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/45 to-transparent"
              aria-hidden
            />
            <SendHorizontal className="sisgen-send-all-icon relative h-3.5 w-3.5" aria-hidden />
            <span className="relative">Enviar Todos</span>
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
