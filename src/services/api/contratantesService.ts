import APIClient from "./apiClient"

export interface Contratante {
    idcontratante: string;
    idtipkar: number;
    kardex: string;
    condicion: string;
    firma: string;
    fechafirma: string;
    cliente: string;
    resfirma: number;
    tiporepresentacion: string;
    indice: string;
    visita: string;
    inscrito: string;
}

export type CreateUpdateContratante = Omit<Contratante, 'idcontratante' | 'cliente'>

interface Props {
    contratanteId?: string;
    byKardex?: boolean;
}

const getContratantesService = ({ byKardex, contratanteId }: Props) => {
    let url = '/contratantes/';
    if (byKardex) {
        url += 'by_kardex/';
    } else if (contratanteId) {
        url = `/contratantes/${contratanteId}/`;
    }
    return new APIClient<Contratante, CreateUpdateContratante>(url);
}

export default getContratantesService