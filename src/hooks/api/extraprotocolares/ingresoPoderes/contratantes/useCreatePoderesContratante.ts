import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getIngresoPoderesContratanteService, { IngresoPoderesContratante, CreateUpdateIngresoPoderesContratante } from "../../../../../services/api/extraprotocolares/IngresoPoderesContratanteService"

interface CreateIngresoPoderesContratanteData {
    access: string;
    ingresoPoderesContratante: CreateUpdateIngresoPoderesContratante;
}

interface Props {
    poderId: number;
}

const useCreatePoderesContratante = ({ poderId }: Props): UseMutationResult<IngresoPoderesContratante, Error, CreateIngresoPoderesContratanteData> => {
    const ingresoPoderesContratanteService = getIngresoPoderesContratanteService({ });
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => ingresoPoderesContratanteService.post(data.ingresoPoderesContratante, data.access),
        onSuccess: (res) => {
            console.log('Ingreso Poder Contratante creado exitosamente:', res);
            queryClient.invalidateQueries({ queryKey: ['ingreso_poderes_contratantes', poderId] });
        },
        onError: (error) => {
            console.error('Error al crear Ingreso Poder Contratante:', error);
        }
    });
}

export default useCreatePoderesContratante;