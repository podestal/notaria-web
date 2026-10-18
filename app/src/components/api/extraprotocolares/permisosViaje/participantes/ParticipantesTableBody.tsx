import { useEffect } from "react";
import { motion } from "framer-motion";
import { FileSearch } from "lucide-react";
import useGetContratantesByViaje from "../../../../../hooks/api/extraprotocolares/permisosViaje/contratantes/useGetContratantesByViaje";
import useAuthStore from "../../../../../store/useAuthStore";
import ParticipanteCard from "./ParticipanteCard";
import ParticipantesTableHeader from "./ParticipantesTableHeader";
import ExtraTableShell from "../../ExtraTableShell";
import { emptyMotionProps } from "../../rowMotion";
import LoadingState from "../../../../ui/LoadingState";

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
    }, [contratantes, setParticipantesDocs]);

    if (isLoading) return <LoadingState message="Cargando participantes…" />
    if (isError) return <p className="my-8 text-center text-sm text-red-600">Error: {error.message}</p>
    if (!isSuccess) return null

  return (
    <ExtraTableShell
      count={contratantes.length}
      label="participantes"
      minWidth="720px"
    >
      <ParticipantesTableHeader />
      {contratantes.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {contratantes.map((contratante, idx) => (
            <ParticipanteCard 
              key={contratante.id_contratante} 
              contratanteViaje={contratante} 
              idx={idx}
            />
          ))}
        </div>
      ) : (
        <motion.div {...emptyMotionProps} className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <FileSearch className="h-5 w-5" aria-hidden />
          </span>
          <p className="text-sm font-medium text-slate-600">No hay participantes disponibles</p>
        </motion.div>
      )}
    </ExtraTableShell>
  )
}

export default ParticipantesTableBody
