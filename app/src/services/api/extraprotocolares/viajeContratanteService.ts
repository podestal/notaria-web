import APIClient from "../apiClient"

export interface ViajeContratante {
    id_viaje: number;
    id_contratante: number;
    c_codcontrat: string;
    c_descontrat: string;
    c_fircontrat: string;
    c_condicontrat: string;
    edad: string;
    condi_edad: string;
    codi_testigo: string;
    tip_incapacidad: string;
    codi_podera: string;
    partida_e: string;
    sede_regis: string;
}

export type CreateUpdateViajeContratante = Omit<ViajeContratante, 'id_contratante'>;

interface Props {
    contratanteId?: number;
    byViaje?: boolean;
}

const getViajeContratanteService = ({ contratanteId, byViaje }: Props) => {
    let url = '/viaje_contratantes/';
    if (contratanteId) {
        url += `${contratanteId}/`;
    } else if (byViaje) {
        url += `by_viaje/`;
    }
    return new APIClient<ViajeContratante, CreateUpdateViajeContratante>(url);
}

export default getViajeContratanteService;