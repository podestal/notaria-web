import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getIngresoPoderesContratanteService, { IngresoPoderesContratante, CreateUpdateIngresoPoderesContratante } from "../../../../../services/api/extraprotocolares/IngresoPoderesContratanteService"

export interface UpdateIngresoPoderesContratanteData {
    access: string;
    ingresoPoderesContratante: CreateUpdateIngresoPoderesContratante;
}  

interface Props {
    ingresoPoderesContratanteId: number;
    poderId: number;
}

const useUpdatePoderesContratantes = ({ ingresoPoderesContratanteId, poderId }: Props): UseMutationResult<IngresoPoderesContratante, Error, UpdateIngresoPoderesContratanteData> => {

    const ingresoPoderesContratanteService = getIngresoPoderesContratanteService({ ingresoPoderesContratanteId });
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateIngresoPoderesContratanteData) => ingresoPoderesContratanteService.update(data.ingresoPoderesContratante, data.access),
        onSuccess: () => {
           queryClient.invalidateQueries({ queryKey: ['ingreso_poderes_contratantes', poderId] });
        }
    });
}

export default useUpdatePoderesContratantes;