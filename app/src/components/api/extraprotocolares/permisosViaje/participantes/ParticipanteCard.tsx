import { motion } from "framer-motion";
import { PERMISO_VIAJE_CONDICIONES } from "../../../../../data/permisoViajeData";
import { ViajeContratante } from "../../../../../services/api/extraprotocolares/viajeContratanteService";
import RemoveParticipante from "./RemoveParticipante";
import UpdateParticipante from "./UpdateParticipante";
import { rowMotionProps } from "../../rowMotion";
import { EXTRA_ID_BADGE_CLASS, EXTRA_ROW_CLASS } from "../../ExtraTableShell";
import { PARTICIPANTES_GRID_COLUMNS } from "./ParticipantesTableHeader";

interface Props {
    contratanteViaje: ViajeContratante;
    idx: number
}

const Empty = () => <span className="text-slate-300">—</span>

const ParticipanteCard = ({ contratanteViaje, idx }: Props) => {
  const condicion = PERMISO_VIAJE_CONDICIONES.find(
    c => c.id_condicion === contratanteViaje.c_condicontrat
  )?.des_condicion

  return (
    <motion.div 
        {...rowMotionProps(idx)}
        className={EXTRA_ROW_CLASS}
        style={{ gridTemplateColumns: PARTICIPANTES_GRID_COLUMNS }}
    >   
        <p className="tabular-nums text-slate-500">{idx + 1}</p>
        <div>
            <span className={EXTRA_ID_BADGE_CLASS}>{contratanteViaje.c_codcontrat || <Empty />}</span>
        </div>
        <p className="leading-snug text-slate-800">{contratanteViaje.c_descontrat || <Empty />}</p>
        <p className="text-slate-600">{contratanteViaje.c_fircontrat || <Empty />}</p>
        <p className="leading-snug text-slate-700">{condicion || <Empty />}</p>
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
            <UpdateParticipante contratanteViaje={contratanteViaje} />
            <RemoveParticipante contratanteViaje={contratanteViaje} />
        </div>
    </motion.div>
  )
}

export default ParticipanteCard
