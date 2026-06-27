import { useQuery, UseQueryResult } from "@tanstack/react-query"
import {
    ComplianceUsersResponse,
    getComplianceUsers,
} from "../../services/compliance/complianceService"

interface Props {
    access: string
    month?: number
}

const useGetComplianceUsers = ({
    access,
    month,
}: Props): UseQueryResult<ComplianceUsersResponse, Error> => {
    return useQuery({
        queryKey: ["compliance", "users", month ?? "current"],
        queryFn: () => getComplianceUsers(access, month),
        enabled: Boolean(access),
        refetchOnWindowFocus: false,
    })
}

export default useGetComplianceUsers
