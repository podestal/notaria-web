import { useState } from 'react'
import { motion } from 'framer-motion'
import { PdtError } from '../../../../../services/api/pdtKardexErrors'
import TopModal from '../../../../ui/TopModal'
import PreKardexForm from '../../registrosUif/PreKardexForm'
import getTitleCase from '../../../../../utils/getTitleCase'
import { EXTRA_ID_BADGE_CLASS, EXTRA_ROW_CLASS } from '../../../extraprotocolares/ExtraTableShell'
import { rowMotionProps } from '../../../extraprotocolares/rowMotion'

export const PDT_KARDEX_GRID =
    "minmax(120px,1.1fr) minmax(180px,1.8fr) minmax(220px,2.4fr)"

interface Props {
    error: PdtError
    index?: number
}

const ArchivosPdtKardexCard = ({ error, index = 0 }: Props) => {
    const [open, setOpen] = useState(false)

  return (
    <>
    <motion.div
        {...rowMotionProps(index)}
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setOpen(true)
            }
        }}
        className={`${EXTRA_ROW_CLASS} cursor-pointer`}
        style={{ gridTemplateColumns: PDT_KARDEX_GRID }}
    >
        <div>
            <span className={EXTRA_ID_BADGE_CLASS}>{error.kardex}</span>
        </div>
        <p className="leading-snug text-slate-800">{getTitleCase(error.typeAct || '') || '—'}</p>
        <p className="leading-snug text-slate-600">{error.errorItem || '—'}</p>
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
