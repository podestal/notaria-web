import { useState } from 'react'
import { motion } from 'framer-motion'
import { PdtError } from '../../../../../services/api/pdtKardexErrors'
import TopModal from '../../../../ui/TopModal'
import PreKardexForm from '../../registrosUif/PreKardexForm'
import getTitleCase from '../../../../../utils/getTitleCase'
import { EXTRA_ID_BADGE_CLASS, EXTRA_ROW_CLASS } from '../../../extraprotocolares/ExtraTableShell'
import { rowMotionProps } from '../../../extraprotocolares/rowMotion'

export const PDT_KARDEX_GRID =
    "auto minmax(110px,1fr) minmax(160px,1.6fr) minmax(200px,2.2fr) minmax(56px,0.6fr)"

interface Props {
    error: PdtError
    index?: number
    selected: boolean
    onToggle: (selected: boolean) => void
}

const ArchivosPdtKardexCard = ({ error, index = 0, selected, onToggle }: Props) => {
    const [open, setOpen] = useState(false)
    const correctable = Number(error.isCorrectable) === 1

  return (
    <>
    <motion.div
        {...rowMotionProps(index)}
        className={`${EXTRA_ROW_CLASS} items-center`}
        style={{ gridTemplateColumns: PDT_KARDEX_GRID }}
    >
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <input
                type="checkbox"
                className="h-3.5 w-3.5 cursor-pointer accent-emerald-600 disabled:cursor-not-allowed disabled:opacity-40"
                checked={correctable && selected}
                disabled={!correctable}
                title={correctable ? "Marcar para subsanar" : "Este error no es autocorregible"}
                onChange={(e) => onToggle(e.target.checked)}
            />
        </div>
        <div
            role="button"
            tabIndex={0}
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setOpen(true)
                }
            }}
            className="cursor-pointer"
        >
            <span className={EXTRA_ID_BADGE_CLASS}>{error.kardex}</span>
        </div>
        <p
            role="button"
            tabIndex={0}
            onClick={() => setOpen(true)}
            className="cursor-pointer leading-snug text-slate-800"
        >
            {getTitleCase(error.act || '') || '—'}
        </p>
        <p
            role="button"
            tabIndex={0}
            onClick={() => setOpen(true)}
            className="cursor-pointer leading-snug text-slate-600"
        >
            {error.errorItem || '—'}
        </p>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            {error.fileType || '—'}
        </p>
    </motion.div>
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
        portal
    >
        <PreKardexForm
            isOpen={open}
            kardexId={error.idKardex}
        />
    </TopModal>
    </>
  )
}

export default ArchivosPdtKardexCard
