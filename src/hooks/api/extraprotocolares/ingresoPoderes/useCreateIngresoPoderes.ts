import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import { getIngresoPoderesServiceSingle, IngresoPoderes, CreateUpdateIngresoPoderes } from "../../../../services/api/extraprotocolares/ingresoPoderes";

export interface CreateIngresoPoderesData {
    access: string
    ingresoPoderes: CreateUpdateIngresoPoderes
}

const useCreateIngresoPoderes = (): UseMutationResult<IngresoPoderes, Error, CreateIngresoPoderesData> => {
    const queryClient = useQueryClient();
    const ingresoPoderesService = getIngresoPoderesServiceSingle({})

    return useMutation({
        mutationFn: (data: CreateIngresoPoderesData) => ingresoPoderesService.post(data.ingresoPoderes, data.access),
        onSuccess: res => {
            console.log('Ingreso de Poderes creado exitosamente', res);
            queryClient.invalidateQueries({ queryKey: ['ingreso_poderes', 1] });
        },
        onError: error => {
            console.error('Error al crear el Ingreso de Poderes:', error);
        }
    });
}

export default useCreateIngresoPoderes;