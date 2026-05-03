import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  CreateSerieNotarial,
  SerieNotarial,
  serieNotarialService,
} from "../../services/signatum/serieNotarialService"

export interface CreateSerieNotarialData {
  access: string
  serieNotarial: CreateSerieNotarial
}

const useCreateSerieNotarial = (): UseMutationResult<
  SerieNotarial,
  Error,
  CreateSerieNotarialData
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSerieNotarialData) =>
      serieNotarialService.post(data.serieNotarial, data.access),
    onSuccess: (_data, variables) => {
      const idtipkar = variables.serieNotarial.idtipkar
      void queryClient.invalidateQueries({
        queryKey: ["signatum", "series-notariales", idtipkar],
      })
    },
    onError: (error) => {
      console.error("Error creating serie notarial:", error)
    },
  })
}

export default useCreateSerieNotarial

