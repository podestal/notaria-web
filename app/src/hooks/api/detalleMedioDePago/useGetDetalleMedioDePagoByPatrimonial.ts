import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getDetalleMedioDePagoService, {DetalleMedioDePago} from "../../../services/api/detalleMedioDePago"

interface Props {
    itemmp: string;
    access: string;
}

const useGetDetalleMedioDePagoByPatrimonial = ({ itemmp, access }: Props): UseQueryResult<DetalleMedioDePago[]> => {

    const detalleMedioDePagoService = getDetalleMedioDePagoService({ by_patrimonial: true })
    const params = { itemmp }

    return useQuery({
        queryKey: ['detalle_medio_de_pago', 'by_patrimonial', itemmp],
        queryFn: () => detalleMedioDePagoService.get(access, params),
    })
}
export default useGetDetalleMedioDePagoByPatrimonial