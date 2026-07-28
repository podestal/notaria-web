import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  AdminReservation,
  ReverseAdminReservationBody,
  reverseAdminReservation,
} from "../../services/signatum/adminReservationsService"

export interface ReverseAdminReservationData {
  access: string
  id: number
  body: ReverseAdminReservationBody
}

const useReverseAdminReservation = (): UseMutationResult<
  AdminReservation,
  Error,
  ReverseAdminReservationData
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ access, id, body }: ReverseAdminReservationData) =>
      reverseAdminReservation(access, id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["signatum", "admin", "reservations"],
      })
      void queryClient.invalidateQueries({
        queryKey: ["signatum", "admin", "counters"],
      })
    },
    onError: (error) => {
      console.error("Error reversing admin reservation:", error)
    },
  })
}

export default useReverseAdminReservation
