import { useQuery, UseQueryResult } from "@tanstack/react-query"
import {
  AdminCounter,
  AdminCountersFilters,
  getAdminCounters,
} from "../../services/signatum/adminCountersService"

interface Props {
  access: string
  filters?: AdminCountersFilters
  enabled?: boolean
}

const useGetAdminCounters = ({
  access,
  filters = {},
  enabled = true,
}: Props): UseQueryResult<AdminCounter[], Error> => {
  return useQuery({
    queryKey: ["signatum", "admin", "counters", filters],
    queryFn: () => getAdminCounters(access, filters),
    enabled: Boolean(access) && enabled,
    refetchOnWindowFocus: false,
  })
}

export default useGetAdminCounters
