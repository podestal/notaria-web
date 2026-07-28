import { useQuery, UseQueryResult } from "@tanstack/react-query"
import {
  AdminCountersFilters,
  AdminFreedSlotsPage,
  getAdminFreedSlots,
} from "../../services/signatum/adminCountersService"

interface Props {
  access: string
  filters?: AdminCountersFilters
  enabled?: boolean
}

const useGetAdminFreedSlots = ({
  access,
  filters = {},
  enabled = true,
}: Props): UseQueryResult<AdminFreedSlotsPage, Error> => {
  return useQuery({
    queryKey: ["signatum", "admin", "counters", "freed-slots", filters],
    queryFn: () => getAdminFreedSlots(access, filters),
    enabled: Boolean(access) && enabled,
    refetchOnWindowFocus: false,
  })
}

export default useGetAdminFreedSlots
