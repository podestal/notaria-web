import { useQuery, UseQueryResult } from "@tanstack/react-query"
import {
    ContratantesProgressResponse,
    getContratantesProgress,
} from "../../services/compliance/complianceService"

interface Props {
    access: string
    kardex: string | null
    enabled?: boolean
}

const useGetContratantesProgress = ({
    access,
    kardex,
    enabled = true,
}: Props): UseQueryResult<ContratantesProgressResponse, Error> => {
    return useQuery({
        queryKey: ["compliance", "kardex", kardex, "contratantes"],
        queryFn: () => getContratantesProgress(access, kardex!),
        enabled: Boolean(access) && Boolean(kardex) && enabled,
        staleTime: 0,
        refetchOnWindowFocus: false,
    })
}

export default useGetContratantesProgress
