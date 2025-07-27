import { PermisoViaje } from "../../../../services/api/extraprotocolares/permisoViajeService"
import { PERMISO_VIAJE_CONDICIONES } from "../../../../data/permisoViajeData"

interface Props {
    permisoViaje: PermisoViaje
}

const PermisoCard = ({ permisoViaje }: Props) => {

  return (
      <div
        className="grid grid-cols-9 gap-4 p-2 my-4 mx-6 text-xs"
      >
        <div className="text-center">{permisoViaje.num_formu}</div>
        <div className="text-center">{permisoViaje.num_kardex}</div>
        <div className="col-span-2 text-center">
            {permisoViaje.contratantes.map((contratante) => (
                <div 
                    className="grid grid-cols-6 gap-10 items-start justify-start text-left"
                    key={contratante.id_contratante}>
                    <p className="font-semibold">{PERMISO_VIAJE_CONDICIONES.find(condicion => condicion.id_condicion === contratante.c_condicontrat)?.des_condicion}:</p>
                    <p className="col-span-5">{contratante.c_descontrat}</p>
                </div>
            ))}
        </div>
        <div className="text-center">{permisoViaje.fecha_crono}</div>
        <div className="text-center">tipo permiso</div>
        <div className="text-center">{permisoViaje.fec_ingreso}</div>
        <div className="col-span-2 text-center">{permisoViaje.lugar_formu}</div>
      </div>
  )
}

export default PermisoCard