import APIClient from "../apiClient"

export interface IngresoPoderesPage {
    count: number;
    next: string | null;
    previous: string | null;
    results: IngresoPoderes[];
}

export interface IngresoPoderesSimpleContratante {
    id_contrata: number;
    c_descontrat: string;
    c_condicontrat: string;
}


export interface IngresoPoderes {
    id_poder: number;
    num_kardex: string;
    nom_recep: string;
    hora_recep: string;
    id_asunto: string;
    fec_ingreso: string; // Date as string
    referencia: string; 
    nom_comuni: string;
    telf_comuni: string;
    email_comuni: string;
    documento: string;
    id_respon: string;
    des_respon: string;
    doc_presen: string;
    fec_ofre: string; // Date as string
    hora_ofre: string;
    num_formu: string;
    fec_crono: string; // Date as string
    swt_est: string;
    contratantes: IngresoPoderesSimpleContratante[];
}

export type CreateUpdateIngresoPoderes = Omit<IngresoPoderes, 'id_poder' | 'contratantes' | 'num_formu' | 'num_kardex'>

interface Props {
    ingresoPoderesId?: number;
}


export const getIngresoPoderesServiceSingle = ({ ingresoPoderesId }: Props) => {
    let url = '/ingreso_poderes/';
    if (ingresoPoderesId) {
        url += `${ingresoPoderesId}/`;
    }
    return new APIClient<IngresoPoderes, CreateUpdateIngresoPoderes>(url)
}


const getIngresoPoderesService = () => {
    return new APIClient<IngresoPoderesPage, CreateUpdateIngresoPoderes>('/ingreso_poderes/')
}

export default getIngresoPoderesService;
