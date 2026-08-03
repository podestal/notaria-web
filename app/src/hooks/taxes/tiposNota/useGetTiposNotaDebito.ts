import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import {
    getTiposNotaDebito,
    type TipoNotaDebito,
} from "../../../services/taxes/tiposNotaService"

interface Props {
    access: string
    enabled?: boolean
}

const useGetTiposNotaDebito = ({
    access,
    enabled = true,
}: Props): UseQueryResult<TipoNotaDebito[], Error> => {
    return useQuery({
        queryKey: ["taxes-tipos-nota-debito"],
        queryFn: () => getTiposNotaDebito(access),
        enabled: enabled && Boolean(access),
        staleTime: 5 * 60_000,
    })
}

export default useGetTiposNotaDebito
