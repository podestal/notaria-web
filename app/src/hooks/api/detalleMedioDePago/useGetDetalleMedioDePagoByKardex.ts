import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getDetalleMedioDePagoService, {DetalleMedioDePago} from "../../../services/api/detalleMedioDePago"

interface Props {
    kardex: string;
    access: string;
}

const useGetDetalleMedioDePagoByKardex = ({ kardex, access }: Props): UseQueryResult<DetalleMedioDePago[]> => {

    const detalleMedioDePagoService = getDetalleMedioDePagoService({ byKardex: true })
    const params = { kardex }

    return useQuery({
        queryKey: ['detalle_medio_de_pago', 'by_kardex', kardex],
        queryFn: () => detalleMedioDePagoService.get(access, params),
    })
}

export default useGetDetalleMedioDePagoByKardex