import { use } from "react";
import useAuthStore from "../../../../../store/useAuthStore"
import useGetIngresoPoderesContratantesByPoder from "../../../../../hooks/api/extraprotocolares/ingresoPoderes/contratantes/useGetIngresoPoderesContratantesByPoder";

interface Props {
    idPoder: number;
}

const ContratantesTableBody = ({ idPoder }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { data: contratantes, isLoading, isError, error, isSuccess } = useGetIngresoPoderesContratantesByPoder({
        access,
        idPoder
    });

    if (isLoading) return <p className="text-center my-4 animate-pulse">Cargando ...</p>

    if (isError) return <p className="text-center my-4 text-red-500">Error: {error.message}</p>

    if (isSuccess)

  return (
    <div>
        <>{console.log('contratantes', contratantes)}</>
    </div>
  )
}

export default ContratantesTableBody