import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  AdminReservation,
  ReleaseAdminReservationBody,
  releaseAdminReservation,
} from "../../services/signatum/adminReservationsService"

export interface ReleaseAdminReservationData {
  access: string
  id: number
  body: ReleaseAdminReservationBody
}

const useReleaseAdminReservation = (): UseMutationResult<
  AdminReservation,
  Error,
  ReleaseAdminReservationData
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ access, id, body }: ReleaseAdminReservationData) =>
      releaseAdminReservation(access, id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["signatum", "admin", "reservations"],
      })
    },
    onError: (error) => {
      console.error("Error releasing admin reservation:", error)
    },
  })
}

export default useReleaseAdminReservation
