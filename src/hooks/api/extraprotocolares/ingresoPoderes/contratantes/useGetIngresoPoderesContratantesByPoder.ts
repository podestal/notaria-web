import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getIngresoPoderesContratanteService, { IngresoPoderesContratante } from "../../../../../services/api/extraprotocolares/IngresoPoderesContratanteService"

interface Props {
    access: string;
    idPoder: number;
}

const useGetIngresoPoderesContratantesByPoder = ({ access, idPoder }: Props): UseQueryResult<IngresoPoderesContratante[]> => {
    const ingresoPoderesContratanteService = getIngresoPoderesContratanteService({ byPoder: true});
    const params = { id_poder: idPoder.toString() };

    return useQuery({
        queryKey: ['ingreso_poderes_contratantes', idPoder],
        queryFn:  () => ingresoPoderesContratanteService.get(access, params),
    });
};

export default useGetIngresoPoderesContratantesByPoder;