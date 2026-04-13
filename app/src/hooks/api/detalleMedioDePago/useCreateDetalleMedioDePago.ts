import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import getDetalleMedioDePagoService, { DetalleMedioDePago, CreateUpdateDetalleMedioDePago } from "../../../services/api/detalleMedioDePago";

export interface CreateDetalleMedioDePagoData {
    access: string
    detalleMedioDePago: CreateUpdateDetalleMedioDePago
}

interface Props {
    itemmp: string;
}

const useCreateDetalleMedioDePago = ({ itemmp }: Props): UseMutationResult<DetalleMedioDePago, Error, CreateDetalleMedioDePagoData> => {

    const detalleMedioDePagoService = getDetalleMedioDePagoService({  });
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateDetalleMedioDePagoData) => detalleMedioDePagoService.post(data.detalleMedioDePago, data.access),
        onSuccess: (data) => {
            console.log("Detalle Medio de Pago created successfully:", data);
            queryClient.invalidateQueries({
                queryKey:['detalle_medio_de_pago', 'by_patrimonial', itemmp]
            })
            queryClient.invalidateQueries({
                queryKey: ["patrimonial by kardex", data.kardex]
            });
        },
        onError: (error) => {
            console.error("Error creating Detalle Medio de Pago:", error);
        }
    });
};

export default useCreateDetalleMedioDePago;