import { useQuery, UseQueryResult } from "@tanstack/react-query"
import {
    ComplianceMeKardexResponse,
    getComplianceMeKardex,
    getCurrentCompliancePeriod,
} from "../../services/compliance/complianceService"
import useAuthStore from "../../store/useAuthStore"

interface Props {
    access: string
    year?: number
    month?: number
    enabled?: boolean
}

const useGetComplianceMeKardex = ({
    access,
    year,
    month,
    enabled = true,
}: Props): UseQueryResult<ComplianceMeKardexResponse, Error> => {
    const period = getCurrentCompliancePeriod()
    const resolvedYear = year ?? period.year
    const resolvedMonth = month ?? period.month
    const userId = useAuthStore((s) => s.userId)

    return useQuery({
        queryKey: ["compliance", "me", "kardex", userId || "anon", resolvedYear, resolvedMonth],
        queryFn: () => getComplianceMeKardex(access, resolvedYear, resolvedMonth),
        enabled: Boolean(access) && enabled && Boolean(userId),
        refetchOnWindowFocus: true,
        staleTime: 5 * 60 * 1000,
        refetchInterval: 10 * 60 * 1000,
    })
}

export default useGetComplianceMeKardex
