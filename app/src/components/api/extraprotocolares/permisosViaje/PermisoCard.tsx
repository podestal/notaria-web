import { PermisoViaje } from "../../../../services/api/extraprotocolares/permisoViajeService"
import { PERMISO_VIAJE_CONDICIONES, PERMISO_VIAJE_ASUNTOS } from "../../../../data/permisoViajeData"
import TopModal from "../../../ui/TopModal";
import { useState } from "react";
import UpdatePermiso from "./UpdatePermiso";
import getTitleCase from "../../../../utils/getTitleCase";

interface Props {
    permisoViaje: PermisoViaje
    readyOnly?: boolean
}

const PermisoCard = ({ permisoViaje, readyOnly }: Props) => {

    const [open, setOpen] = useState(false);
    

  return (
    <>
    <div
        className={`grid grid-cols-9 gap-4 p-2 my-4 mx-6 text-xs ${permisoViaje.swt_est === 'NC' ? 'bg-amber-500/10 border-amber-500 border-1 rounded-2xl' : ''}`}
      >
        <p 
            onClick={() => {
                if (readyOnly) return;
                setOpen(true)
            }}
            className="text-center text-blue-600 cursor-pointer hover:text-blue-500">{permisoViaje.num_formu}</p>
        <p className="text-center">{permisoViaje.num_kardex}</p>
        <div className="col-span-2 text-center">
            {permisoViaje.contratantes.map((contratante) => (
                <div 
                    className="grid grid-cols-6 gap-10 items-start justify-start text-left"
                    key={contratante.id_contratante}>
                    <p className="font-semibold col-span-2">{PERMISO_VIAJE_CONDICIONES.find(condicion => condicion.id_condicion === contratante.c_condicontrat)?.des_condicion}:</p>
                    <p className="col-span-4">{contratante.c_descontrat}</p>
                </div>
            ))}
        </div>
        <p className="text-center">{permisoViaje.fecha_crono}</p>
        <p className="text-center">{PERMISO_VIAJE_ASUNTOS.find(asunto => asunto.cod_asunto === permisoViaje.asunto)?.des_asunto}</p>
        <p className="text-center">{permisoViaje.fec_ingreso}</p>
        <p className="col-span-2 text-center">{getTitleCase(permisoViaje.lugar_formu || '')}</p>
      </div>
      <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <UpdatePermiso 
            permisoViaje={permisoViaje}
        />
      </TopModal>
    </>
  )
}

export default PermisoCard