import useAuthStore from "../../../../../store/useAuthStore"
import useGetIngresoPoderesContratantesByPoder from "../../../../../hooks/api/extraprotocolares/ingresoPoderes/contratantes/useGetIngresoPoderesContratantesByPoder";
import ContratantesCard from "./ContratantesCard";
import { useEffect } from "react";

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
    }, [contratantes]);

    if (isLoading) return <p className="text-center my-4 animate-pulse">Cargando ...</p>

    if (isError) return <p className="text-center my-4 text-red-500">Error: {error.message}</p>

    if (isSuccess)

  return (
    <>
        {contratantes.length > 0 ?
            contratantes.map((contratante, idx) => (
                <ContratantesCard 
                    key={contratante.id_contrata}
                    contratante={contratante}
                    idx={idx}
                />
            )) :
            <p className="text-center text-xs my-4">No hay contratantes disponibles</p>
        }
    </>
  )
}

export default ContratantesTableBody