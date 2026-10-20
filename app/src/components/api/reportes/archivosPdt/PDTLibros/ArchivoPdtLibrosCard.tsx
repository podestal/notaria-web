import { useState } from "react"
import { motion } from "framer-motion"
import { LibroPdt } from "../../../../../services/api/extraprotocolares/librosService"
import TopModal from "../../../../ui/TopModal"
import useAuthStore from "../../../../../store/useAuthStore"
import useGetLibroByNumlibro from "../../../../../hooks/api/extraprotocolares/aperturaLibros/useGetLibroByNumlibro"
import useGetTipoLibros from "../../../../../hooks/api/extraprotocolares/aperturaLibros/useGetTipoLibros"
import ArchivoPdtPreLibroForm from "./ArchivoPdtPreLibroForm"
import { EXTRA_ID_BADGE_CLASS, EXTRA_ROW_CLASS } from "../../../extraprotocolares/ExtraTableShell"
import { rowMotionProps } from "../../../extraprotocolares/rowMotion"

export const PDT_LIBROS_GRID = "minmax(140px,1.2fr) minmax(280px,2.4fr)"

interface Props {
    error: LibroPdt
    index?: number
}

const ArchivoPdtLibrosCard = ({ error, index = 0 }: Props) => {
    const access = useAuthStore( s => s.access_token) || ''
    const [open, setOpen] = useState(false)

  return (
    <>
    <motion.div
        {...rowMotionProps(index)}
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                setOpen(true)
            }
        }}
        className={`${EXTRA_ROW_CLASS} cursor-pointer`}
        style={{ gridTemplateColumns: PDT_LIBROS_GRID }}
    >
        <div>
            <span className={EXTRA_ID_BADGE_CLASS}>{error.bookNumber}</span>
        </div>
        <p className="leading-snug text-slate-600">{error.errorItem || "—"}</p>
    </motion.div>
    <TopModal isOpen={open} onClose={() => setOpen(false)} portal>
        {(() => {
            const { data: libro, isLoading: isLoadingLibro, isError: isErrorLibro, isSuccess: isSuccessLibro } = useGetLibroByNumlibro({ access, numlibro: error.bookNumber })

            const { data: tipoLibros, isLoading: isLoadingTipoLibros, isError: isErrorTipoLibros, isSuccess: isSuccessTipoLibros } = useGetTipoLibros({access})

            if (isLoadingLibro || isLoadingTipoLibros) return <p className="py-8 text-center text-sm text-slate-500">Cargando…</p>
            if (isErrorLibro || isErrorTipoLibros) return <p className="py-8 text-center text-sm text-rose-600">Error al cargar el libro</p>
            if (isSuccessLibro && isSuccessTipoLibros) return (
                <ArchivoPdtPreLibroForm libro={libro} tipoLibros={tipoLibros} />
            )
            return null
        })()}
    </TopModal>
    </>
  )
}

export default ArchivoPdtLibrosCard
