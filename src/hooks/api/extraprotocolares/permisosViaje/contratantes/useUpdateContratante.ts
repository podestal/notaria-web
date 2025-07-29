import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getViajeContratanteService, { CreateUpdateViajeContratante, ViajeContratante } from "../../../../../services/api/extraprotocolares/viajeContratanteService";

export interface UpdateContratanteData {
    contratante: CreateUpdateViajeContratante;
    access: string;
}

interface Props {
    viaje_id: number; 
    contratanteId: number;
}

export const useUpdateContratante = ({viaje_id, contratanteId}: Props): UseMutationResult<ViajeContratante, Error, UpdateContratanteData> => {
    const queryClient = useQueryClient();
    const viajeContratanteService = getViajeContratanteService({ contratanteId });

    return useMutation({
        mutationFn: (data: UpdateContratanteData) => viajeContratanteService.update(data.contratante, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['viaje_contratantes', viaje_id] });
        }
    });
}

export default useUpdateContratante;
