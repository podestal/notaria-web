import { useQuery, UseQueryResult } from "@tanstack/react-query"
import {
    getInstrumentoProgress,
    InstrumentoProgressResponse,
} from "../../services/compliance/complianceService"

interface Props {
    access: string
    kardex: string | null
    enabled?: boolean
}

const useGetInstrumentoProgress = ({
    access,
    kardex,
    enabled = true,
}: Props): UseQueryResult<InstrumentoProgressResponse, Error> => {
    return useQuery({
        queryKey: ["compliance", "kardex", kardex, "instrumento"],
        queryFn: () => getInstrumentoProgress(access, kardex!),
        enabled: Boolean(access) && Boolean(kardex) && enabled,
        staleTime: 0,
        refetchOnWindowFocus: false,
    })
}

export default useGetInstrumentoProgress
