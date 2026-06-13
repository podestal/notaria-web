import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import {
    getReciboAnularService,
    type AnularReciboPayload,
    type Recibo,
} from "../../../services/taxes/recibosService"

export interface AnularReciboData {
    access: string
    payload: AnularReciboPayload
}

interface Props {
    id_recibo: number
}

const useAnularRecibo = ({
    id_recibo,
}: Props): UseMutationResult<Recibo, Error, AnularReciboData> => {
    const queryClient = useQueryClient()
    const service = getReciboAnularService(id_recibo)

    return useMutation({
        mutationFn: (data: AnularReciboData) =>
            service.post(data.payload, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes-recibos"] })
            queryClient.invalidateQueries({
                queryKey: ["taxes-resumen-recibos-pendientes"],
            })
        },
    })
}

export default useAnularRecibo
