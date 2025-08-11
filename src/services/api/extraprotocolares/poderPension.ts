import APIClient from "../apiClient";

export interface PoderPension {
    id_poder: number;
    id_pension: number;
    p_crono: string;
    p_fecha: string;
    p_numformu: string;
    p_domicilio: string;
    p_pension: string;
    p_mespension: string;
    p_anopension: string;
    p_plazopoder: string;
    p_fecotor: string;
    p_fecvcto: string;
    p_presauto: string;
    p_observ: string;
}

export type CreateUpdatePoderPension = Omit<PoderPension, "id_pension">;

interface Props {
    idPoderPension?: number;
    byPoder?: boolean;
}

const getPoderPensionService = ({ idPoderPension, byPoder }: Props) => {
    let url = '/poderes_pension/'
    if (idPoderPension) {
        url += `${idPoderPension}/`
    }
    if (byPoder) {
        url += 'by_poder/'
    }
    return new APIClient<PoderPension, CreateUpdatePoderPension>(url)
}

export default getPoderPensionService