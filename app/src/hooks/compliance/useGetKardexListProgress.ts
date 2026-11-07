import { useQuery, UseQueryResult } from "@tanstack/react-query"
import {
    getKardexListProgress,
    KardexListProgressResponse,
} from "../../services/compliance/complianceService"

interface Props {
    access: string
    kardex: string[]
    enabled?: boolean
}

const useGetKardexListProgress = ({
    access,
    kardex,
    enabled = true,
}: Props): UseQueryResult<KardexListProgressResponse, Error> => {
    const keys = [...kardex].filter(Boolean).sort()
    return useQuery({
        queryKey: ["compliance", "kardex", "progress", keys.join(",")],
        queryFn: () => getKardexListProgress(access, keys),
        enabled: enabled && keys.length > 0,
        staleTime: 120_000,
        refetchOnWindowFocus: false,
    })
}

export default useGetKardexListProgress
