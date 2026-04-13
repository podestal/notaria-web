import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query"
import { getIngresoPoderesServiceSingle, IngresoPoderes, CreateUpdateIngresoPoderes } from "../../../../services/api/extraprotocolares/ingresoPoderes"

export interface UpdateIngresoPoderesData {
    access: string;
    ingresoPoderes: CreateUpdateIngresoPoderes;
}

interface Props {
    page: number;
    ingresoPoderesId: number;
}

export const useUpdateIngresoPoderes = ({ page, ingresoPoderesId }: Props): UseMutationResult<IngresoPoderes, Error, UpdateIngresoPoderesData> => {

    const queryClient = useQueryClient();
    const ingresoPoderesServiceSingle = getIngresoPoderesServiceSingle({ ingresoPoderesId });

    return useMutation({
        mutationFn: async ({ access, ingresoPoderes }) => {
            return ingresoPoderesServiceSingle.update(ingresoPoderes, access);
        },
        onSuccess: (data) => {
            console.log('Ingreso Poder actualizado:', data);
            queryClient.invalidateQueries({ queryKey: ['ingreso_poderes', page] });
        },
        onError: (error) => {
            console.error('Error al actualizar Ingreso Poder:', error);
        },
    });
};

export default useUpdateIngresoPoderes;