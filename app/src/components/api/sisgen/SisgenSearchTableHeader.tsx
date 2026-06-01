import { useState } from "react"
import type { SisgenSearchHandlers } from "../../../hooks/sisgen/sisgenSearchKeys"
import type { SisgenSearchFilters } from "../../../utils/buildSisgenSearchFilters"
import { buildSisgenSearchFilters } from "../../../utils/buildSisgenSearchFilters"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import useAuthStore from "../../../store/useAuthStore"
import SisgenSendAllPreviewModal from "./SisgenSendAllPreviewModal"

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
      <div className="grid grid-cols-7 gap-4 bg-slate-200 text-black text-xs font-semibold p-2 mb-4 items-center">
        <p>Nº</p>
        <p className="col-span-2">Nº Kardex</p>
        <p>Acto</p>
        <p>Estado</p>
        <p className="leading-tight">
          Validación
          <span className="block text-[10px] font-normal text-slate-600">
            Err. / Obs. / Pers.
          </span>
        </p>
        <button
          type="button"
          className="bg-orange-500 text-white px-2 py-2 rounded-md cursor-pointer hover:bg-orange-600 transition-all duration-300 flex items-center justify-center disabled:opacity-60"
          onClick={handleOpenSendAllPreview}
          disabled={sisgenDocs.length === 0}
        >
          <p className="text-xs">Enviar Todos</p>
        </button>
      </div>

      <SisgenSendAllPreviewModal
        isOpen={previewOpen}
        onClose={handleClosePreview}
        access={access}
        filters={previewFilters}
      />
    </>
  )
}

export default SisgenSearchTableHeader
