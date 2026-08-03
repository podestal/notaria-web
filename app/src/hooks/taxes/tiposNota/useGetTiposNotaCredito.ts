import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import {
    getTiposNotaCredito,
    type TipoNotaCredito,
} from "../../../services/taxes/tiposNotaService"

interface Props {
    access: string
    enabled?: boolean
}

const useGetTiposNotaCredito = ({
    access,
    enabled = true,
}: Props): UseQueryResult<TipoNotaCredito[], Error> => {
    return useQuery({
        queryKey: ["taxes-tipos-nota-credito"],
        queryFn: () => getTiposNotaCredito(access),
        enabled: enabled && Boolean(access),
        staleTime: 5 * 60_000,
    })
}

export default useGetTiposNotaCredito
