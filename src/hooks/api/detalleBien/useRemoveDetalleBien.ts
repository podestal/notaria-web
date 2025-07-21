import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getDetalleBienService, { DetalleBien } from "../../../services/api/detalleBienService"

export interface DetalleBienRemoveData {
    access: string
}

interface Props {
    kardex: string
    detalleBienId: number
}

const useRemoveDetalleBien = ({ kardex, detalleBienId }: Props): UseMutationResult<DetalleBien, Error, DetalleBienRemoveData> => {
    const queryClient = useQueryClient()
    const detalleBienService = getDetalleBienService({ detalleBienId })

    return useMutation({
        mutationFn: ({ access }: DetalleBienRemoveData) => detalleBienService.delete(access),
        onSuccess: (data) => {
            console.log('DetalleBien removed successfully:', data);
            queryClient.invalidateQueries({ queryKey: ['detalleBienesByKardex', kardex] })
        },
        onError: (error) => {
            console.error('Error removing DetalleBien:', error);
        }
    })
}

export default useRemoveDetalleBien
