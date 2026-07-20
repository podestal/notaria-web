import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  AdminCounter,
  getAdminCounterByKey,
} from "../../services/signatum/adminCountersService"

export interface EnsureAdminCounterData {
  access: string
  year: number
  idtipkar: number
}

const useEnsureAdminCounter = (): UseMutationResult<
  AdminCounter,
  Error,
  EnsureAdminCounterData
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ access, year, idtipkar }: EnsureAdminCounterData) =>
      getAdminCounterByKey(access, year, idtipkar),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["signatum", "admin", "counters"],
      })
    },
    onError: (error) => {
      console.error("Error ensuring admin counter:", error)
    },
  })
}

export default useEnsureAdminCounter
