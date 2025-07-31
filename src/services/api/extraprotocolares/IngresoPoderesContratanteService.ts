import APIClient from "../apiClient"

        // "id_contrata": 11,
        // "id_poder": 7,
        // "c_codcontrat": "02162178",
        // "c_descontrat": "ZAPANA ROSAS GREGORIO ORESTES",
        // "c_fircontrat": "SI",
        // "c_condicontrat": "007",
        // "codi_asegurado": "",
        // "codi_testigo": "",
        // "tip_incapacidad": ""

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

export type CreateUpdateIngresoPoderesContratante = Omit<IngresoPoderesContratante, 'id_contrata' | 'id_poder'>;

interface Props {
    ingresoPoderesContratanteId?: number;
    byPoder: boolean;
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
