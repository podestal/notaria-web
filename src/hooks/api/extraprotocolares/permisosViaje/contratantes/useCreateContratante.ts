import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getViajeContratanteService, { CreateUpdateViajeContratante, ViajeContratante } from "../../../../../services/api/extraprotocolares/viajeContratanteService"

export interface CreateContratanteData {
    contratante: CreateUpdateViajeContratante;
    access: string;
}

interface Props {
    viaje_id: number; 
}

const useCreateContratante = ({ viaje_id }: Props): UseMutationResult<ViajeContratante, Error, CreateContratanteData> => {
    const viajeContratanteService = getViajeContratanteService({});
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => viajeContratanteService.post(data.contratante, data.access),
        onSuccess: (res) => {
            console.log('Contratante creado exitosamente:', res);
            queryClient.invalidateQueries({ queryKey: ['viaje_contratantes', viaje_id] });
            queryClient.invalidateQueries({ queryKey:  ['permisosViaje', 1]})
        },
        onError: (error) => {
            console.error('Error al crear el contratante:', error);
        }
    });
}

export default useCreateContratante;