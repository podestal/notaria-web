import APIClient from "../apiClient"

export interface PoderRegistro {
    id_poder: number;
    id_fuerareg: number;
    id_tipo: string;
    f_fecha: string;
    f_plazopoder: string;
    f_fecotor: string;
    f_fecvcto: string;
    f_solicita: string;
    f_observ: string;
}

export type CreateUpdatePoderRegistro = Omit<PoderRegistro, 'id_fuerareg'>

interface Props {
    idPoderRegistro?: number;
    byPoder?: boolean;
}

const getPoderRegistroService = ({ idPoderRegistro, byPoder }: Props) => {
    let url = '/poderes_fuerareg/'
    if (idPoderRegistro) {
        url += `${idPoderRegistro}/`
    } else if (byPoder) {
        url += 'by_poder/'
    }
    return new APIClient<PoderRegistro, CreateUpdatePoderRegistro>(url)
}

export default getPoderRegistroService