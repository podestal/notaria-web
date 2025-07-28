import useGetContratantesByViaje from "../../../../../hooks/api/extraprotocolares/permisosViaje/contratantes/useGetContratantesByViaje";
import useAuthStore from "../../../../../store/useAuthStore";
import {PERMISO_VIAJE_CONDICIONES} from "../../../../../data/permisoViajeData";
import { Pen, Trash } from "lucide-react";

interface Props {
    viajeId: number;
}

const ParticipantesTableBody = ({ viajeId }: Props) => {

    const access = useAuthStore(s => s.access_token) || "";
    const { data: contratantes, isLoading, isError, error, isSuccess } = useGetContratantesByViaje({ access, viaje_id: viajeId });

    if (isLoading) return <p className="text-center text-xs animate-pulse my-4">Cargando participantes...</p>;
    if (isError) return <p className="text-center text-xs text-red-500 my-4">Error: {error.message}</p>;

    if (isSuccess)
    
  return (
    <>
      <>{console.log('contratantes', contratantes)}</>
      {contratantes.length > 0 ? (
        <div>
          {contratantes.map((contratante, idx) => (
            <div 
              key={contratante.id_contratante}
              className="grid grid-cols-8 gap-4 justify-center items-center text-center text-xs p-2 my-4 mx-6 border-b border-gray-200"
            >   
                <p>{idx + 1}</p>
                <p>{contratante.c_codcontrat}</p>
                <p className="col-span-2">{contratante.c_descontrat}</p>
                <p>{contratante.c_fircontrat}</p>
                <p className="col-span-2">
                    {PERMISO_VIAJE_CONDICIONES.find(condicion => condicion.id_condicion === contratante.c_condicontrat)?.des_condicion}
                </p>
                <div className="flex justify-center items-center gap-4 text-xs">
                    <Pen />
                    <Trash />
                </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xs my-4">No hay participantes disponibles</p>
      )}
    </>
  )
}

export default ParticipantesTableBody