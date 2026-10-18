import { useState } from 'react';
import { motion } from 'framer-motion';
import { Domiciliario } from '../../../../services/api/extraprotocolares/domiciliarioService'
import TopModal from '../../../ui/TopModal';
import UpdateDomiciliario from './UpdateDomiciliario';
import useUpdateDomiciliario from '../../../../hooks/api/extraprotocolares/domiciliario/useUpdateDomiciliario';
import { rowMotionProps } from '../rowMotion';
import { EXTRA_ID_BADGE_CLASS, EXTRA_ROW_CLASS } from '../ExtraTableShell';
import { DOMICILIARIO_GRID_COLUMNS } from './DomiciliarioTableHeader';

interface Props {
    domiciliario: Domiciliario;
    readyOnly?: boolean;
    index?: number;
}

const Empty = () => <span className="text-slate-300">—</span>

const DomiciliarioCard = ({ domiciliario, readyOnly, index = 0 }: Props) => {
    const [open, setOpen] = useState(false);
    const updateDomiciliario = useUpdateDomiciliario({ domiciliarioId: domiciliario.id_domiciliario, page: 1 });
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
        style={{ gridTemplateColumns: DOMICILIARIO_GRID_COLUMNS }}
    >
        <div>
            <span className={EXTRA_ID_BADGE_CLASS}>{domiciliario.num_certificado || <Empty />}</span>
        </div>
        <p className="tabular-nums text-slate-600">{domiciliario.fec_ingreso || <Empty />}</p>
        <p className="font-medium leading-snug text-slate-800">{domiciliario.nombre_solic || <Empty />}</p>
        <p className="leading-snug text-slate-700">{domiciliario.motivo_solic || <Empty />}</p>
        <p className="leading-snug text-slate-600">{domiciliario.domic_solic || <Empty />}</p>
    </motion.div>
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
    >
        <UpdateDomiciliario 
            updateDomiciliario={updateDomiciliario}
            domiciliario={domiciliario}
            onRequestCloseForm={() => setOpen(false)}
        />
    </TopModal>
    </>
  )
}

export default DomiciliarioCard
