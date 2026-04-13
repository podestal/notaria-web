import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getDetalleBienService, { DetalleBien, DetalleBienCreateUpdate } from "../../../services/api/detalleBienService"

export interface DetalleBienUpdateData {
    access: string
    detalleBien: DetalleBienCreateUpdate
}

interface Props {
    detalleBienId: number
}

const useUpdateDetalleBien = ({ detalleBienId }: Props): UseMutationResult<DetalleBien, Error, DetalleBienUpdateData> => {
    const queryClient = useQueryClient()
    const detalleBienService = getDetalleBienService({ detalleBienId })

    return useMutation({
        mutationFn: ({ access, detalleBien }: DetalleBienUpdateData) => detalleBienService.update(detalleBien, access),
        onSuccess: (data) => {
            console.log('DetalleBien updated successfully:', data);
            queryClient.invalidateQueries({ queryKey: ['detalleBienesByKardex', data.kardex] })
        },
        onError: (error) => {
            console.error('Error updating DetalleBien:', error);
        }
    })
}

export default useUpdateDetalleBien