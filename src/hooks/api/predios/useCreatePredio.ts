import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getPrediosService, { Predio, PredioCreateUpdate } from "../../../services/api/prediosService";

interface CreatePredioData {
    access: string
    predio: PredioCreateUpdate
}
const useCreatePredio = (): UseMutationResult<Predio, Error, CreatePredioData> => {
    const queryClient = useQueryClient()
    const prediosService = getPrediosService({ })

    return useMutation({
        mutationFn: ( data: CreatePredioData ) => prediosService.post(data.predio, data.access),
        onSuccess: (res) => {
            console.log("Predio created successfully:", res)
            queryClient.invalidateQueries({ queryKey: ['prediosByKardex', res.kardex] })
        },
        onError: (error) => {
            console.error("Error creating predio:", error)
        }
    })
}

export default useCreatePredio