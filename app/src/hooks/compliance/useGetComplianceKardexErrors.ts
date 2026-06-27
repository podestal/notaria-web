import { useQuery, UseQueryResult } from "@tanstack/react-query"
import {
    ComplianceKardexErrorsResponse,
    getComplianceKardexErrors,
} from "../../services/compliance/complianceService"

interface Props {
    access: string
    kardex: string | null
    enabled?: boolean
}

const useGetComplianceKardexErrors = ({
    access,
    kardex,
    enabled = true,
}: Props): UseQueryResult<ComplianceKardexErrorsResponse, Error> => {
    return useQuery({
        queryKey: ["compliance", "kardex", kardex, "errors"],
        queryFn: () => getComplianceKardexErrors(access, kardex!),
        enabled: Boolean(access) && Boolean(kardex) && enabled,
        refetchOnWindowFocus: false,
    })
}

export default useGetComplianceKardexErrors
