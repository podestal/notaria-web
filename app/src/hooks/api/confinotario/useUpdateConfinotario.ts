import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import {
  Confinotario,
  UpdateConfinotario,
  updateConfinotarioService,
} from "../../../services/api/confinotarioService"

export interface UpdateConfinotarioData {
  access: string
  idnotar: number
  confinotario: UpdateConfinotario
}

const useUpdateConfinotario = (): UseMutationResult<
  Confinotario,
  Error,
  UpdateConfinotarioData
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateConfinotarioData) => {
      const updateConfinotario = updateConfinotarioService(data.idnotar)
      return updateConfinotario.update(data.confinotario, data.access)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["confinotario"] })
    },
    onError: (error) => {
      console.error("Error updating confinotario:", error)
    },
  })
}

export default useUpdateConfinotario
