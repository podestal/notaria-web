import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  AdminCounter,
  PatchAdminCounterBody,
  patchAdminCounter,
} from "../../services/signatum/adminCountersService"

export interface PatchAdminCounterData {
  access: string
  id: number
  body: PatchAdminCounterBody
}

const usePatchAdminCounter = (): UseMutationResult<
  AdminCounter,
  Error,
  PatchAdminCounterData
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ access, id, body }: PatchAdminCounterData) =>
      patchAdminCounter(access, id, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["signatum", "admin", "counters"],
      })
    },
    onError: (error) => {
      console.error("Error patching admin counter:", error)
    },
  })
}

export default usePatchAdminCounter
