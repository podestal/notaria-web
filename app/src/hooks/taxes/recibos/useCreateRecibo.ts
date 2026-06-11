import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import {
    getRecibosServiceSingle,
    type CreateUpdateRecibo,
    type Recibo,
} from "../../../services/taxes/recibosService"

export interface CreateReciboData {
    access: string
    recibo: CreateUpdateRecibo
}

const useCreateRecibo = (): UseMutationResult<Recibo, Error, CreateReciboData> => {
    const queryClient = useQueryClient()
    const service = getRecibosServiceSingle()

    return useMutation({
        mutationFn: (data: CreateReciboData) =>
            service.post(data.recibo, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes-recibos"] })
        },
    })
}

export default useCreateRecibo
