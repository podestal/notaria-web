import APIClient from "../apiClient"

export interface IngresoPoderesContratante {
    id_contrata: number;
    id_poder: number;
    c_codcontrat: string;
    c_descontrat: string;
    c_condicontrat: string;
    c_fircontrat: string;
    codi_asegurado: string;
    codi_testigo: string;
    tip_incapacidad: string;
}

export type CreateUpdateIngresoPoderesContratante = Omit<IngresoPoderesContratante, 'id_contrata'>;

interface Props {
    ingresoPoderesContratanteId?: number;
    byPoder?: boolean;
}

export const getIngresoPoderesContratanteService = ({ ingresoPoderesContratanteId, byPoder }: Props) => {
    let url = '/poderes_contratantes/';
    if (byPoder) {
        url += `by_poder/`;
    } else if (ingresoPoderesContratanteId) {
        url += `${ingresoPoderesContratanteId}/`;
    }
    return new APIClient<IngresoPoderesContratante, CreateUpdateIngresoPoderesContratante>(url);
}

export default getIngresoPoderesContratanteService;
