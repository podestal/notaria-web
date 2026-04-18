import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { createNotarizationReservationService, CreateNotarizationReservation, NotarizationReservation } from "../../services/signatum/notarizationReservationService";

export interface CreateNotarizationReservationData {
    access: string;
    notarizationReservation: CreateNotarizationReservation;
}

export const useCreateNotarizationReservation = (): UseMutationResult<NotarizationReservation, Error, CreateNotarizationReservationData> => {
    return useMutation({
        mutationFn: (data: CreateNotarizationReservationData) => createNotarizationReservationService.post(data.notarizationReservation, data.access),
        onSuccess: (data) => {
            console.log('Notarization reservation created successfully:', data);
        },
        onError: (error) => {
            console.error('Error creating notarization reservation:', error);
        }
    })
}