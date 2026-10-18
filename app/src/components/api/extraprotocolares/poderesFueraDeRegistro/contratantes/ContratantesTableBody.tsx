import { useEffect } from "react";
import { motion } from "framer-motion";
import { FileSearch } from "lucide-react";
import useAuthStore from "../../../../../store/useAuthStore"
import useGetIngresoPoderesContratantesByPoder from "../../../../../hooks/api/extraprotocolares/ingresoPoderes/contratantes/useGetIngresoPoderesContratantesByPoder";
import ContratantesCard from "./ContratantesCard";
import ContratantesTableHeader from "./ContratantesTableHeader";
import ExtraTableShell from "../../ExtraTableShell";
import { emptyMotionProps } from "../../rowMotion";
import LoadingState from "../../../../ui/LoadingState";

interface Props {
    idPoder: number;
    setContratantesDocs: (docs: string[]) => void;
}

const ContratantesTableBody = ({ idPoder, setContratantesDocs }: Props) => {
    const access = useAuthStore(s => s.access_token) || ''

    const { data: contratantes, isLoading, isError, error, isSuccess } = useGetIngresoPoderesContratantesByPoder({
        access,
        idPoder
    });

    useEffect(() => {
        if (contratantes) {
          const docs = contratantes.map(contratante => contratante.c_codcontrat);
          setContratantesDocs(docs);
        }
    }, [contratantes, setContratantesDocs]);

    if (isLoading) return <LoadingState message="Cargando contratantes…" />
    if (isError) return <p className="my-8 text-center text-sm text-red-600">Error: {error.message}</p>
    if (!isSuccess) return null

  return (
    <ExtraTableShell
      count={contratantes.length}
      label="contratantes"
      minWidth="720px"
    >
      <ContratantesTableHeader />
      {contratantes.length > 0 ? (
        <div className="divide-y divide-slate-100">
          {contratantes.map((contratante, idx) => (
            <ContratantesCard 
              key={contratante.id_contrata}
              contratante={contratante}
              idx={idx}
            />
          ))}
        </div>
      ) : (
        <motion.div {...emptyMotionProps} className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <FileSearch className="h-5 w-5" aria-hidden />
          </span>
          <p className="text-sm font-medium text-slate-600">No hay contratantes disponibles</p>
        </motion.div>
      )}
    </ExtraTableShell>
  )
}

export default ContratantesTableBody
