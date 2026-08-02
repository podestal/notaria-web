import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import {
    getReciboDetail,
    type ReciboDetail,
} from "../../../services/taxes/recibosService"

interface Props {
    access: string
    id_recibo: number
    enabled?: boolean
}

const useGetReciboDetail = ({
    access,
    id_recibo,
    enabled = true,
}: Props): UseQueryResult<ReciboDetail, Error> => {
    return useQuery({
        queryKey: ["taxes-recibo-detail", id_recibo],
        queryFn: () => getReciboDetail(access, id_recibo),
        enabled: enabled && Boolean(access) && id_recibo > 0,
        staleTime: 30_000,
    })
}

export default useGetReciboDetail
