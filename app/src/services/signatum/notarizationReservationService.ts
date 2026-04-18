import APIClient from "./apiClient"

export interface NotarizationReservation {
    id: number;
    idtipkar: number;
    kardex: string;
    fecha_conclusion: string;
    folio_ini: string;
    folio_fin: string;
    papel_ini: string;
    papel_fin: string;
    num_minuta: string;
    num_escritura: string;
    fecha_escritura: string;
    status: string;
    created_at: string;
    held_by: number;
}

export type CreateNotarizationReservation = {
    kardex: string;
    idtipkar: number;
}

export const createNotarizationReservationService = new APIClient<NotarizationReservation, CreateNotarizationReservation>('notarization-reservations/')