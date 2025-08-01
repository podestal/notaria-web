import { IngresoPoderesContratante } from "../../../../../services/api/extraprotocolares/IngresoPoderesContratanteService"
import { PODERES_CONDICIONES } from "../../../../../data/poderesFueraDeRegistro";

interface Props {
    contratante: IngresoPoderesContratante
    idx: number;
}

const ContratantesCard = ({ contratante, idx }: Props) => {
  return (
    <div 
        className="grid grid-cols-8 gap-4 justify-center items-center text-center text-xs p-2 my-4 mx-6 border-b border-gray-200"
    >   
        <p>{idx + 1}</p>
        <p>{contratante.c_codcontrat}</p>
        <p className="col-span-2">{contratante.c_descontrat}</p>
        <p>{contratante.c_fircontrat}</p>
        <p className="col-span-2">
            {PODERES_CONDICIONES.find(condicion => condicion.id_condicion === contratante.c_condicontrat)?.des_condicion}
        </p>
        <div className="flex justify-center items-center gap-4 text-xs">
            {/* <UpdateParticipante
                contratanteViaje={contratanteViaje}
            />
            <RemoveParticipante
                contratanteViaje={contratanteViaje}
            /> */}
        </div>
    </div>
  )
}

export default ContratantesCard