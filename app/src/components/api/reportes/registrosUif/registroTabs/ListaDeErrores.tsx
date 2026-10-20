import { useState } from "react"
import { motion } from "framer-motion"
import { FileSearch } from "lucide-react"
import { KardexError } from "../../../../../services/api/kardexService"
import TopModal from "../../../../ui/TopModal"
import PreKardexForm from "../PreKardexForm"
import getTitleCase from "../../../../../utils/getTitleCase"
import { EXTRA_HEADER_CLASS, EXTRA_ID_BADGE_CLASS, EXTRA_ROW_CLASS } from "../../../extraprotocolares/ExtraTableShell"
import { emptyMotionProps, rowMotionProps } from "../../../extraprotocolares/rowMotion"

interface Props {
    kardexErrors: KardexError[]
}

const ERRORS_GRID = "minmax(120px,1.1fr) minmax(180px,1.8fr) minmax(240px,2.6fr)"

const ListaDeErrores = ({
    kardexErrors
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [kardexId, setKardexId] = useState(0)
  const errors = kardexErrors ?? []

  return (
    <>
        <p className="mb-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">{errors.length}</span>{" "}
            {errors.length === 1 ? "error encontrado" : "errores encontrados"}
            <span className="ml-2 text-[11px] text-slate-400">Haga clic en un kardex para abrirlo</span>
        </p>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
            <div style={{ minWidth: 720 }}>
                <div className={EXTRA_HEADER_CLASS} style={{ gridTemplateColumns: ERRORS_GRID }}>
                    <p>Kardex</p>
                    <p>Acto</p>
                    <p>Descripción del error</p>
                </div>
                {errors.length === 0 ? (
                    <motion.div
                        {...emptyMotionProps}
                        className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center"
                    >
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                            <FileSearch className="h-5 w-5" aria-hidden />
                        </span>
                        <p className="text-sm font-medium text-slate-600">Sin errores UIF en este rango</p>
                    </motion.div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {errors.map((error, idx) => (
                            <motion.div
                                key={`${error.kardex}-${idx}`}
                                {...rowMotionProps(idx)}
                                role="button"
                                tabIndex={0}
                                onClick={() => {
                                    setIsOpen(true)
                                    setKardexId(error.idkardex)
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault()
                                        setIsOpen(true)
                                        setKardexId(error.idkardex)
                                    }
                                }}
                                className={`${EXTRA_ROW_CLASS} cursor-pointer`}
                                style={{ gridTemplateColumns: ERRORS_GRID }}
                            >
                                <div>
                                    <span className={EXTRA_ID_BADGE_CLASS}>{error.kardex}</span>
                                </div>
                                <p className="leading-snug text-slate-800">{getTitleCase(error.act || "") || "—"}</p>
                                <p className="leading-snug text-slate-600">{error.error_description || "—"}</p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
        <TopModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            portal
        >
            <PreKardexForm
                isOpen={isOpen}
                kardexId={kardexId}
            />
        </TopModal>
    </>
  )
}

export default ListaDeErrores
