import useGetContratantesByViaje from "../../../../../hooks/api/extraprotocolares/permisosViaje/contratantes/useGetContratantesByViaje";
import useAuthStore from "../../../../../store/useAuthStore";

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
    <div>
        <>{console.log('contratantes', contratantes)}</>
    </div>
  )
}

export default ParticipantesTableBody