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
    byKardex?: boolean;
}

const getContratantesService = ({ byKardex }: Props) => {
    let url = '/contratantes/';
    if (byKardex) {
        url += 'by_kardex/';
    }
    return new APIClient<Contratante, CreateUpdateContratante>(url);
}

export default getContratantesService