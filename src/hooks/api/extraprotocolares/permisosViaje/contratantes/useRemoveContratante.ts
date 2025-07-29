import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getViajeContratanteService, { ViajeContratante}  from "../../../../../services/api/extraprotocolares/viajeContratanteService"

export interface RemoveContratanteData {
    access: string;
}

interface Props {
    viajeContratanteId: number
    viaje_id: number;
}

const useRemoveContratante = ({ viajeContratanteId, viaje_id }: Props): UseMutationResult<ViajeContratante, Error, RemoveContratanteData> => {
    const queryClient = useQueryClient()
    const viajeContratanteService = getViajeContratanteService({ contratanteId: viajeContratanteId })

    return useMutation({
        mutationFn: (data: RemoveContratanteData) => viajeContratanteService.delete(data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['viaje_contratantes', viaje_id] });
        }
    })
}

export default useRemoveContratante