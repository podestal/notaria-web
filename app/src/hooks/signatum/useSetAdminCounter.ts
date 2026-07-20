import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  AdminCounter,
  SetAdminCounterBody,
  setAdminCounter,
} from "../../services/signatum/adminCountersService"

export interface SetAdminCounterData {
  access: string
  body: SetAdminCounterBody
}

const useSetAdminCounter = (): UseMutationResult<
  AdminCounter,
  Error,
  SetAdminCounterData
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ access, body }: SetAdminCounterData) =>
      setAdminCounter(access, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["signatum", "admin", "counters"],
      })
    },
    onError: (error) => {
      console.error("Error setting admin counter:", error)
    },
  })
}

export default useSetAdminCounter
