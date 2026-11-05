import { useQuery, UseQueryResult } from "@tanstack/react-query"
import {
    getParticipaProgress,
    ParticipaProgressResponse,
} from "../../services/compliance/complianceService"

interface Props {
    access: string
    kardex: string | null
    enabled?: boolean
}

const useGetParticipaProgress = ({
    access,
    kardex,
    enabled = true,
}: Props): UseQueryResult<ParticipaProgressResponse, Error> => {
    return useQuery({
        queryKey: ["compliance", "kardex", kardex, "participa"],
        queryFn: () => getParticipaProgress(access, kardex!),
        enabled: Boolean(access) && Boolean(kardex) && enabled,
        staleTime: 0,
        refetchOnWindowFocus: false,
    })
}

export default useGetParticipaProgress
