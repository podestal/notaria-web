import { useQuery, UseQueryResult } from "@tanstack/react-query"
import {
    ComplianceMeKardexMonthResponse,
    getComplianceMeKardexMonth,
} from "../../services/compliance/complianceService"
import useAuthStore from "../../store/useAuthStore"

interface Props {
    access: string
    year: number | null
    month: number | null
    enabled?: boolean
}

const useGetComplianceMeKardexMonth = ({
    access,
    year,
    month,
    enabled = true,
}: Props): UseQueryResult<ComplianceMeKardexMonthResponse, Error> => {
    const userId = useAuthStore((s) => s.userId)

    return useQuery({
        queryKey: [
            "compliance",
            "me",
            "kardex",
            "month",
            userId || "anon",
            year,
            month,
        ],
        queryFn: () => getComplianceMeKardexMonth(access, year!, month!),
        enabled:
            Boolean(access) &&
            enabled &&
            Boolean(userId) &&
            year != null &&
            month != null,
        refetchOnWindowFocus: false,
    })
}

export default useGetComplianceMeKardexMonth
