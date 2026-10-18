import { motion } from "framer-motion";
import { IngresoPoderesContratante } from "../../../../../services/api/extraprotocolares/IngresoPoderesContratanteService"
import { PODERES_CONDICIONES } from "../../../../../data/poderesFueraDeRegistro";
import RemoveContratante from "./RemoveContratante";
import UpdateContratante from "./UpdateContratante";
import { rowMotionProps } from "../../rowMotion";
import { EXTRA_ID_BADGE_CLASS, EXTRA_ROW_CLASS } from "../../ExtraTableShell";
import { CONTRATANTES_GRID_COLUMNS } from "./ContratantesTableHeader";

interface Props {
    contratante: IngresoPoderesContratante
    idx: number;
}

const Empty = () => <span className="text-slate-300">—</span>

const ContratantesCard = ({ contratante, idx }: Props) => {
  const condicion = PODERES_CONDICIONES.find(
    c => c.id_condicion === contratante.c_condicontrat
  )?.des_condicion

  return (
    <motion.div 
        {...rowMotionProps(idx)}
        className={EXTRA_ROW_CLASS}
        style={{ gridTemplateColumns: CONTRATANTES_GRID_COLUMNS }}
    >   
        <p className="tabular-nums text-slate-500">{idx + 1}</p>
        <div>
            <span className={EXTRA_ID_BADGE_CLASS}>{contratante.c_codcontrat || <Empty />}</span>
        </div>
        <p className="leading-snug text-slate-800">{contratante.c_descontrat || <Empty />}</p>
        <p className="text-slate-600">{contratante.c_fircontrat || <Empty />}</p>
        <p className="leading-snug text-slate-700">{condicion || <Empty />}</p>
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
            <UpdateContratante contratante={contratante} />
            <RemoveContratante 
                idPoder={contratante.id_poder}
                ingresoPoderesContratanteId={contratante.id_contrata}
            />
        </div>
    </motion.div>
  )
}

export default ContratantesCard
