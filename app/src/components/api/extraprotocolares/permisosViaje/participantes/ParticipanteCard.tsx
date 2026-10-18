import { motion } from "framer-motion";
import { PERMISO_VIAJE_CONDICIONES } from "../../../../../data/permisoViajeData";
import { ViajeContratante } from "../../../../../services/api/extraprotocolares/viajeContratanteService";
import RemoveParticipante from "./RemoveParticipante";
import UpdateParticipante from "./UpdateParticipante";
import { rowMotionProps } from "../../rowMotion";

interface Props {
    contratanteViaje: ViajeContratante;
    idx: number
}

const ParticipanteCard = ({ contratanteViaje, idx }: Props) => {
  return (
    <motion.div 
        {...rowMotionProps(idx)}
        className="grid grid-cols-8 gap-4 justify-center items-center text-center text-xs p-2 my-4 mx-6 border-b border-gray-200 transition-colors hover:bg-sky-50/60"
    >   
        <p>{idx + 1}</p>
        <p>{contratanteViaje.c_codcontrat}</p>
        <p className="col-span-2">{contratanteViaje.c_descontrat}</p>
        <p>{contratanteViaje.c_fircontrat}</p>
        <p className="col-span-2">
            {PERMISO_VIAJE_CONDICIONES.find(condicion => condicion.id_condicion === contratanteViaje .c_condicontrat)?.des_condicion}
        </p>
        <div className="flex justify-center items-center gap-4 text-xs">
            <UpdateParticipante
                contratanteViaje={contratanteViaje}
            />
            <RemoveParticipante
                contratanteViaje={contratanteViaje}
            />
            {/* <Pen />
            <Trash /> */}
        </div>
    </motion.div>
  )
}

export default ParticipanteCard