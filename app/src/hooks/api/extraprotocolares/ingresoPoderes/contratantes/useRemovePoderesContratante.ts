import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getIngresoPoderesContratanteService, { IngresoPoderesContratante } from "../../../../../services/api/extraprotocolares/IngresoPoderesContratanteService"

interface RemovePoderesContratanteData {
    access: string;
}

interface Props {
    ingresoPoderesContratanteId: number;
    idPoder: number;
}

const useRemovePoderesContratante = ({ingresoPoderesContratanteId, idPoder}: Props): UseMutationResult<IngresoPoderesContratante, Error, RemovePoderesContratanteData> => {
    const queryClient = useQueryClient()
    const ingresoPoderesContratanteService = getIngresoPoderesContratanteService({ ingresoPoderesContratanteId });

    return useMutation({
        mutationFn: (data: RemovePoderesContratanteData) => ingresoPoderesContratanteService.delete(data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ingreso_poderes_contratantes', idPoder] })
        },
        onError: (error) => {
            console.error('Error al eliminar el contratante:', error);
        }
    })
}

export default useRemovePoderesContratante