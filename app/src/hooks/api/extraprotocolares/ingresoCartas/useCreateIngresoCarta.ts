import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import { getIngresoCartasServiceSingle, IngresoCartas, CreateUpdateIngresoCartas } from "../../../../services/api/extraprotocolares/ingresoCartas"

export interface CreateIngresoCartaData {
    access: string;
    ingresoCarta: CreateUpdateIngresoCartas;
}

const useCreateIngresoCarta = (): UseMutationResult<IngresoCartas, Error, CreateIngresoCartaData> => {
    const queryClient = useQueryClient();
    const ingresoCartasService = getIngresoCartasServiceSingle({});

    return useMutation({
        mutationFn: (data: CreateIngresoCartaData) => ingresoCartasService.post(data.ingresoCarta, data.access),
        onSuccess: res => {
            // Invalidate the query to refetch the list of cartas
            console.log("Ingreso Carta created successfully:", res);
            
            queryClient.invalidateQueries({queryKey: ['ingreso_cartas', 1]});
        },
        onError: error => {
            console.error("Error creating Ingreso Carta:", error);
        }
    });
}

export default useCreateIngresoCarta;