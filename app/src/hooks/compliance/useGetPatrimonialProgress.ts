import { useQuery, UseQueryResult } from "@tanstack/react-query"
import {
    getPatrimonialProgress,
    PatrimonialProgressResponse,
} from "../../services/compliance/complianceService"

interface Props {
    access: string
    kardex: string | null
    enabled?: boolean
}

const useGetPatrimonialProgress = ({
    access,
    kardex,
    enabled = true,
}: Props): UseQueryResult<PatrimonialProgressResponse, Error> => {
    return useQuery({
        queryKey: ["compliance", "kardex", kardex, "patrimonial"],
        queryFn: () => getPatrimonialProgress(access, kardex!),
        enabled: Boolean(access) && Boolean(kardex) && enabled,
        staleTime: 0,
        refetchOnWindowFocus: false,
    })
}

export default useGetPatrimonialProgress
