import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getViajeContratanteService, { ViajeContratante } from "../../../../../services/api/extraprotocolares/viajeContratanteService"

interface Props {
    access: string;
    viaje_id: number;
}

const useGetContratantesByViaje = ({ access, viaje_id }: Props): UseQueryResult<ViajeContratante[]> => {

    const viajeContratanteService = getViajeContratanteService({ byViaje: true });
    const params = { id_viaje: viaje_id.toString() };

    return useQuery({
        queryKey: ['viaje_contratantes', viaje_id],
        queryFn: () => viajeContratanteService.get(access, params),
    });
}

export default useGetContratantesByViaje;