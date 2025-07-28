import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import { getPermisoViajeServiceSingle, PermisoViaje, CreateUpdatePermisoViaje } from "../../../../services/api/extraprotocolares/permisoViajeService"

export interface CreatePermisoViajeData {
    permisoViaje: CreateUpdatePermisoViaje;
    access: string;
}

const useCreatePermisoViaje = (): UseMutationResult<PermisoViaje, Error, CreatePermisoViajeData> => {
    const permisoViajeService = getPermisoViajeServiceSingle({});
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => permisoViajeService.post(data.permisoViaje, data.access),
        onSuccess: (res) => {
            // Optionally handle success, e.g., invalidate queries or show a success message
            console.log('Permiso de viaje creado exitosamente:', res);
            queryClient.invalidateQueries({ queryKey: ['permisosViaje', 1] });
        },
        onError: (error) => {
            // Handle error, e.g., show an error message
            console.error('Error al crear el permiso de viaje:', error);
        }
    });
}

export default useCreatePermisoViaje;