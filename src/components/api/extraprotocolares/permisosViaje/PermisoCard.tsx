import { PermisoViaje } from "../../../../services/api/extraprotocolares/permisoViajeService"

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
        <div className="col-span-2 text-center">Participantes</div>
        <div className="text-center">{permisoViaje.fecha_crono}</div>
        <div className="text-center">tipo permiso</div>
        <div className="text-center">{permisoViaje.fec_ingreso}</div>
        <div className="col-span-2 text-center">{permisoViaje.lugar_formu}</div>
      </div>
  )
}

export default PermisoCard