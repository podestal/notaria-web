import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import {
    getRecibosCreateService,
    type CreateReciboResponse,
    type CreateUpdateRecibo,
} from "../../../services/taxes/recibosService"

export interface CreateReciboData {
    access: string
    recibo: CreateUpdateRecibo
}

const useCreateRecibo = (): UseMutationResult<
    CreateReciboResponse,
    Error,
    CreateReciboData
> => {
    const queryClient = useQueryClient()
    const service = getRecibosCreateService()

    return useMutation({
        mutationFn: (data: CreateReciboData) =>
            service.post(data.recibo, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes-recibos"] })
        },
    })
}

export default useCreateRecibo
