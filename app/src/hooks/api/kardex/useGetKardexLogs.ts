import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import {
    getKardexLogs,
    KARDEX_LOGS_QUERY_KEY,
    type KardexLogPage,
} from "../../../services/api/kardexLogsService"

interface Props {
    access: string
    idkardex: number
    page?: number
    enabled?: boolean
}

const useGetKardexLogs = ({
    access,
    idkardex,
    page = 1,
    enabled = true,
}: Props): UseQueryResult<KardexLogPage, Error> => {
    return useQuery({
        queryKey: [KARDEX_LOGS_QUERY_KEY, idkardex, page],
        queryFn: () => getKardexLogs(access, idkardex, page),
        enabled: enabled && Boolean(access) && idkardex > 0,
        refetchOnWindowFocus: false,
        staleTime: 0,
    })
}

export default useGetKardexLogs
