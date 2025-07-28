import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import { getPermisoViajeServiceSingle, PermisoViaje, CreateUpdatePermisoViaje } from "../../../../services/api/extraprotocolares/permisoViajeService"

export interface UpdatePermisoViajeData {
    permisoViaje: CreateUpdatePermisoViaje;
    access: string;
}

interface Props {
    page: number;
    permisoViajeId: number; // Assuming you need the ID to update a specific permiso
}

const useUpdatePermisoViaje = ({ page, permisoViajeId }: Props): UseMutationResult<PermisoViaje, Error, UpdatePermisoViajeData> => {
    const permisoViajeService = getPermisoViajeServiceSingle({ permisoViajeId });
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => permisoViajeService.update(data.permisoViaje, data.access),
        onSuccess: (res) => {
            console.log('Permiso de viaje actualizado exitosamente:', res);
            queryClient.invalidateQueries({ queryKey: ['permisosViaje', page] });
        },
        onError: (error) => {
            console.error('Error al actualizar el permiso de viaje:', error);
        }
    });
}

export default useUpdatePermisoViaje;