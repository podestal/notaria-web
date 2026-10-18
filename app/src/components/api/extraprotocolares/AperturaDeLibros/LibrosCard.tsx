import { useState } from "react";
import { motion } from "framer-motion";
import { Libro } from "../../../../services/api/extraprotocolares/librosService"
import TopModal from "../../../ui/TopModal";
import { NUMERO_LIBROS, TIPOS_FOLIOS } from "../../../../data/librosData";
import UpdateLibro from "./UpdateLibro";
import { rowMotionProps } from "../rowMotion";
import { EXTRA_ID_BADGE_CLASS, EXTRA_ROW_CLASS } from "../ExtraTableShell";
import { LIBROS_GRID_COLUMNS } from "./LibrosTableHeader";

interface Props {
    libro: Libro
    readyOnly?: boolean
    page: number
    index?: number
}

const Empty = () => <span className="text-slate-300">—</span>

const LibrosCard = ({ libro, readyOnly, page, index = 0 }: Props) => {
    const [open, setOpen] = useState(false);
    const openRow = () => {
        if (readyOnly) return
        setOpen(true)
    }

  return (
    <>
        <motion.div
            {...rowMotionProps(index)}
            role={readyOnly ? undefined : "button"}
            tabIndex={readyOnly ? undefined : 0}
            onClick={openRow}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    openRow()
                }
            }}
            className={`${EXTRA_ROW_CLASS} ${readyOnly ? "" : "cursor-pointer"}`}
            style={{ gridTemplateColumns: LIBROS_GRID_COLUMNS }}
        >
            <div>
                <span className={EXTRA_ID_BADGE_CLASS}>{libro.numlibro}-{libro.ano}</span>
            </div>
            <p className="tabular-nums text-slate-600">{libro.fecing || <Empty />}</p>
            <p className="font-medium leading-snug text-slate-800" title={libro.empresa || undefined}>
                {libro.empresa || <Empty />}
            </p>
            <p className="leading-snug text-slate-700">{libro.idtiplib || <Empty />}</p>
            <p className="font-mono tabular-nums">
                {NUMERO_LIBROS.find(n => n.idnlibro === libro.idnlibro)?.desnlibro || <Empty />}
            </p>
            <p className="font-mono text-center tabular-nums">{libro.folio || <Empty />}</p>
            <p>{TIPOS_FOLIOS.find(folio => folio.idtipfol === libro.idtipfol)?.destipfol || <Empty />}</p>
            <p className="font-mono tabular-nums text-slate-600">{libro.ruc || <Empty />}</p>
        </motion.div>
        <TopModal
            isOpen={open}
            onClose={() => setOpen(false)}
        >
            <UpdateLibro libro={libro} page={page} />
        </TopModal>
    </>
  )
}

export default LibrosCard
