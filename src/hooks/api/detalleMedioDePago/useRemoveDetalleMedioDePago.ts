import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getDetalleMedioDePagoService, { DetalleMedioDePago } from "../../../services/api/detalleMedioDePago";

export interface RemoveDetalleMedioDePagoData {
    access: string;
}

interface Props {
    itemmp: string;
    medioDePagoId: number; 
    kardex: string
}

const useRemoveDetalleMedioDePago = ({ itemmp, medioDePagoId, kardex }: Props): UseMutationResult<DetalleMedioDePago, Error, RemoveDetalleMedioDePagoData> => {
    const detalleMedioDePagoService = getDetalleMedioDePagoService({ medioDePagoId });
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RemoveDetalleMedioDePagoData) => detalleMedioDePagoService.delete(data.access),
        onSuccess: (data) => {
            console.log("Detalle Medio de Pago removed successfully:", data);
            queryClient.invalidateQueries({
                queryKey: ['detalle_medio_de_pago', 'by_patrimonial', itemmp]
            });
            queryClient.invalidateQueries({
                queryKey: ["patrimonial by kardex", kardex]
            });
        },
        onError: (error) => {
            console.error("Error removing Detalle Medio de Pago:", error);
        }
    });
};

export default useRemoveDetalleMedioDePago;