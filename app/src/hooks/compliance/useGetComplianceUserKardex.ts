import { useQuery, UseQueryResult } from "@tanstack/react-query"
import {
    ComplianceUserKardexResponse,
    getComplianceUserKardex,
} from "../../services/compliance/complianceService"

interface Props {
    access: string
    userId: number | null
    year: number
    month: number
    enabled?: boolean
}

const useGetComplianceUserKardex = ({
    access,
    userId,
    year,
    month,
    enabled = true,
}: Props): UseQueryResult<ComplianceUserKardexResponse, Error> => {
    return useQuery({
        queryKey: ["compliance", "users", userId, "kardex", year, month],
        queryFn: () => getComplianceUserKardex(access, userId!, year, month),
        enabled: Boolean(access) && userId != null && enabled,
        refetchOnWindowFocus: false,
    })
}

export default useGetComplianceUserKardex
