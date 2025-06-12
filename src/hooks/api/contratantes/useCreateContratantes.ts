import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query"
import getContratantesService, { Contratante, CreateUpdateContratante } from "../../../services/api/contratantesService"

export interface CreateContratanteData {
    contratante: CreateUpdateContratante
}

const useCreateContratante = (): UseMutationResult<Contratante, Error, CreateContratanteData> => {
    const queryClient = useQueryClient()
    const contratantesService = getContratantesService({  })

    return useMutation({
        mutationFn: (data: CreateContratanteData) => contratantesService.post(data.contratante),
        onSuccess: (res) => {

            queryClient.invalidateQueries({ queryKey: ['contratantes by kardex', res.kardex] })
        },
    })
}
export default useCreateContratante