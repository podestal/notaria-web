import APIClient from "./apiClient"

export interface Contratante {
    idcontratante: string;
    idtipkar: number;
    kardex: string;
    condicion: string;
    condicion_str: string;
    firma: string;
    fechafirma: string;
    cliente: string;
    cliente_id: string;
    resfirma: number;
    tiporepresentacion: string;
    indice: string;
    visita: string;
    inscrito: string;
    idcontratanterp: string;
}

export type CreateUpdateContratante = Omit<Contratante, 'idcontratante' | 'cliente' | 'cliente_id' | 'condicion_str'>

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