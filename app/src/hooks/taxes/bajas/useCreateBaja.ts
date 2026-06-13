import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import bajasService, { type CreateBajaPayload } from "../../../services/taxes/bajasService"

export interface CreateBajaData {
    access: string
    payload: CreateBajaPayload
}

const useCreateBaja = (): UseMutationResult<unknown, Error, CreateBajaData> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateBajaData) =>
            bajasService.post(data.payload, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes-recibos"] })
            queryClient.invalidateQueries({
                queryKey: ["taxes-resumen-recibos-pendientes"],
            })
        },
    })
}

export default useCreateBaja
