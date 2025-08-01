import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getIngresoCartasService, {IngresoCartasPage} from "../../../../services/api/extraprotocolares/ingresoCartas"

interface Props {
    access: string
    page: number
}

const useGetIngresoCartas = ({ access, page }: Props): UseQueryResult<IngresoCartasPage, Error> => {
    const ingresoCartasService = getIngresoCartasService();
    let params = { page: page.toString() };

    return useQuery({
        queryKey: ['ingreso_cartas', page],
        queryFn: () => ingresoCartasService.get(access, params),
    });
}

export default useGetIngresoCartas;