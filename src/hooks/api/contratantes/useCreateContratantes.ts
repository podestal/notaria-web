import { UseMutationResult, useMutation } from "@tanstack/react-query"
import getContratantesService, { Contratante, CreateUpdateContratante } from "../../../services/api/contratantesService"

export interface CreateContratanteData {
    contratante: CreateUpdateContratante
}

const useCreateContratante = (): UseMutationResult<Contratante, Error, CreateContratanteData> => {
    const contratantesService = getContratantesService({  })

    return useMutation({
        mutationFn: (data: CreateContratanteData) => contratantesService.post(data.contratante),
        onSuccess: () => {
            console.log('Contratante created successfully');
        },
        onError: (error) => {
            console.error("Error creating Contratante:", error)
        }
    })
}
export default useCreateContratante