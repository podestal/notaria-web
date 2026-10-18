import { useState } from "react"
import { motion } from "framer-motion"
import { TIPO_PODERES } from "../../../../data/poderesFueraDeRegistro"
import { IngresoPoderes } from "../../../../services/api/extraprotocolares/ingresoPoderes"
import TopModal from "../../../ui/TopModal"
import UpdatePoderesFueraDeRegistro from "./UpdatePoderesFueraDeRegistro"
import { rowMotionProps } from "../rowMotion"
import { EXTRA_ID_BADGE_CLASS, EXTRA_ROW_CLASS } from "../ExtraTableShell"
import { PODERES_GRID_COLUMNS } from "./PoderesFueraDeRegistroTableHeader"

interface Props {
    poder: IngresoPoderes
    page: number
    readyOnly?: boolean
    index?: number
}

const Empty = () => <span className="text-slate-300">—</span>

const PoderesFueraDeRegistroCard = ({ poder, page, readyOnly, index = 0 }: Props) => {
    const [open, setOpen] = useState(false);
    const openRow = () => {
        if (readyOnly) return
        setOpen(true)
    }
    const tipo = TIPO_PODERES.find(p => p.id_asunto === poder.id_asunto)?.des_asunto

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
            className={`${EXTRA_ROW_CLASS} ${readyOnly ? "" : "cursor-pointer"} ${
                poder.swt_est === "NC" ? "bg-amber-50/80 ring-1 ring-inset ring-amber-200" : ""
            }`}
            style={{ gridTemplateColumns: PODERES_GRID_COLUMNS }}
        >
            <div>
                <span className={EXTRA_ID_BADGE_CLASS}>{poder.id_poder || <Empty />}</span>
            </div>
            <p className="font-mono tabular-nums text-slate-800">{poder.num_kardex || <Empty />}</p>
            <p className="leading-snug text-slate-700">{tipo || <Empty />}</p>
            <p className="tabular-nums text-slate-600">{poder.fec_crono || <Empty />}</p>
            <div className="min-w-0 space-y-0.5">
                {poder.contratantes?.length ? poder.contratantes.map((contratante) => (
                    <p key={contratante.id_contrata} className="leading-snug text-slate-800">
                        {contratante.c_descontrat}
                    </p>
                )) : <Empty />}
            </div>
            <p className="tabular-nums text-slate-600">{poder.fec_ingreso || <Empty />}</p>
        </motion.div>
        <TopModal
            isOpen={open}
            onClose={() => setOpen(false)}
        >
            <UpdatePoderesFueraDeRegistro 
                poder={poder} 
                page={page} 
            />
        </TopModal>
    </>
  )
}

export default PoderesFueraDeRegistroCard
