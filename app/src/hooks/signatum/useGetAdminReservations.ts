import { useQuery, UseQueryResult } from "@tanstack/react-query"
import {
  AdminReservationsFilters,
  AdminReservationsPage,
  getAdminReservations,
} from "../../services/signatum/adminReservationsService"

interface Props {
  access: string
  filters?: AdminReservationsFilters
  enabled?: boolean
}

const useGetAdminReservations = ({
  access,
  filters = {},
  enabled = true,
}: Props): UseQueryResult<AdminReservationsPage, Error> => {
  return useQuery({
    queryKey: ["signatum", "admin", "reservations", filters],
    queryFn: () => getAdminReservations(access, filters),
    enabled: Boolean(access) && enabled,
    refetchOnWindowFocus: false,
  })
}

export default useGetAdminReservations
