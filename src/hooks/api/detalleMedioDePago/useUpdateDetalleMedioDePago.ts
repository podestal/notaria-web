import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getDetalleMedioDePagoService, { DetalleMedioDePago, CreateUpdateDetalleMedioDePago } from "../../../services/api/detalleMedioDePago";

export interface UpdateDetalleMedioDePagoData {
    access: string
    detalleMedioDePago: CreateUpdateDetalleMedioDePago
}

interface Props {
    itemmp: string;
    medioDePagoId: number; 
    kardex: string
}

const useUpdateDetalleMedioDePago = ({ itemmp, medioDePagoId, kardex }: Props): UseMutationResult<DetalleMedioDePago, Error, UpdateDetalleMedioDePagoData> => {
    const detalleMedioDePagoService = getDetalleMedioDePagoService({ medioDePagoId });
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateDetalleMedioDePagoData) => detalleMedioDePagoService.update(data.detalleMedioDePago, data.access),
        onSuccess: (data) => {
            console.log("Detalle Medio de Pago updated successfully:", data);
            queryClient.invalidateQueries({
                queryKey:['detalle_medio_de_pago', 'by_patrimonial', itemmp]
            })
            queryClient.invalidateQueries({
                queryKey: ["patrimonial by kardex", kardex]
            });
        },
        onError: (error) => {
            console.error("Error updating Detalle Medio de Pago:", error);
        }
    });
};

export default useUpdateDetalleMedioDePago;