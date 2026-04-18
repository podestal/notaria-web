import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateUpdateKardex, Kardex, getSingleKardexService } from "../../../services/api/kardexService";

export interface UpdateKardexData {
    kardex: CreateUpdateKardex;
    access: string;
    signatumReservationId?: number;
}

interface Props {
    kardexId: number;
    signatumReservationId?: number;
}

const useUpdateKardex = ({ kardexId, signatumReservationId }: Props): UseMutationResult<Kardex, Error, UpdateKardexData> => {
    const queryClient = useQueryClient();
    const kardexService = getSingleKardexService({ id: kardexId })
    return useMutation({
        mutationFn: (data: UpdateKardexData) => {
            const reservationId = data.signatumReservationId ?? signatumReservationId
            const params = reservationId
                ? { signatum_reservation_id: reservationId.toString() }
                : undefined
            return kardexService.update(data.kardex, data.access, params)
        },
        onSuccess: (updatedKardex) => {
            // Keep the currently open kardex in sync immediately (e.g. fktemplate in Digitacion tab).
            queryClient.setQueryData(['kardex', kardexId], updatedKardex);

            // Refresh single and list kardex queries regardless of page/filter.
            queryClient.invalidateQueries({ queryKey: ['kardex', kardexId] });
            queryClient.invalidateQueries({ queryKey: ['kardex list'] });

            // Refresh dependent data keyed by kardex code.
            queryClient.invalidateQueries({ queryKey: ["contratantes by kardex", updatedKardex.kardex] });
            queryClient.invalidateQueries({ queryKey: ["documents by kardex", `${updatedKardex.kardex}`] });
        },
        onError: (error) => {
            console.error("Error updating Kardex:", error);
        }   
    });
};

export default useUpdateKardex;