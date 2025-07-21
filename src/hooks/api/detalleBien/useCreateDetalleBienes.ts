import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getDetalleBienService, {DetalleBien, DetalleBienCreateUpdate } from "../../../services/api/detalleBienService"

export interface DetalleBienCreateData {
    access: string
    detalleBien: DetalleBienCreateUpdate
}

const useCreateDetalleBienes = (): UseMutationResult<DetalleBien, Error, DetalleBienCreateData> => {
    const queryClient = useQueryClient()
    const detalleBienService = getDetalleBienService({ })

    return useMutation({
        mutationFn: ({ access, detalleBien }: DetalleBienCreateData) => detalleBienService.post(detalleBien, access),
        onSuccess: (data) => {
            console.log('DetalleBien created successfully:', data);
            queryClient.invalidateQueries({ queryKey: ['detalleBienesByKardex', data.kardex] })
        },
        onError: (error) => {
            console.error('Error creating DetalleBien:', error);
        }
    })
}

export default useCreateDetalleBienes