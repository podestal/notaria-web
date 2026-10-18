import { useEffect } from "react";
import { motion } from "framer-motion";
import useGetContratantesByViaje from "../../../../../hooks/api/extraprotocolares/permisosViaje/contratantes/useGetContratantesByViaje";
import useAuthStore from "../../../../../store/useAuthStore";
import ParticipanteCard from "./ParticipanteCard";
import { emptyMotionProps } from "../../rowMotion";

interface Props {
    viajeId: number;
    setParticipantesDocs: (docs: string[]) => void;
}

const ParticipantesTableBody = ({ viajeId, setParticipantesDocs }: Props) => {

    const access = useAuthStore(s => s.access_token) || "";
    const { data: contratantes, isLoading, isError, error, isSuccess } = useGetContratantesByViaje({ access, viaje_id: viajeId });

    useEffect(() => {
        if (contratantes) {
          const docs = contratantes.map(contratante => contratante.c_codcontrat);
          setParticipantesDocs(docs);
        }
    }, [contratantes]);

    if (isLoading) return <p className="text-center text-xs animate-pulse my-4">Cargando participantes...</p>;
    if (isError) return <p className="text-center text-xs text-red-500 my-4">Error: {error.message}</p>;

    if (isSuccess)
    
  return (
    <>
      {contratantes.length > 0 ? (
        <div>
          {contratantes.map((contratante, idx) => (
            <ParticipanteCard 
              key={contratante.id_contratante} 
              contratanteViaje={contratante} 
              idx={idx}
            />
          ))}
        </div>
      ) : (
        <motion.p {...emptyMotionProps} className="text-center text-xs my-4 text-slate-500">No hay participantes disponibles</motion.p>
      )}
    </>
  )
}

export default ParticipantesTableBody