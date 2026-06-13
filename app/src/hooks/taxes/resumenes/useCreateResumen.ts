import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import {
    resumenesCreateService,
    type CreateResumenPayload,
    type Resumen,
} from "../../../services/taxes/resumenesService"

export interface CreateResumenData {
    access: string
    payload: CreateResumenPayload
}

const useCreateResumen = (): UseMutationResult<Resumen, Error, CreateResumenData> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateResumenData) =>
            resumenesCreateService.post(data.payload, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes-resumenes"] })
            queryClient.invalidateQueries({
                queryKey: ["taxes-resumen-recibos-pendientes"],
            })
            queryClient.invalidateQueries({ queryKey: ["taxes-recibos"] })
        },
    })
}

export default useCreateResumen
