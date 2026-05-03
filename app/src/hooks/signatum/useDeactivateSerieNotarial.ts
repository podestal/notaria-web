import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query"
import { SerieNotarial, updateSerieNotarial } from "../../services/signatum/serieNotarialService"

export interface DeactivateSerieNotarialData {
  access: string
  id: number
  idtipkar: number
}

const useDeactivateSerieNotarial = (): UseMutationResult<
  SerieNotarial,
  Error,
  DeactivateSerieNotarialData
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ access, id }: DeactivateSerieNotarialData) =>
      updateSerieNotarial(access, id, { activo: false }),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["signatum", "series-notariales", variables.idtipkar],
      })
    },
    onError: (error) => {
      console.error("Error deactivating serie notarial:", error)
    },
  })
}

export default useDeactivateSerieNotarial
