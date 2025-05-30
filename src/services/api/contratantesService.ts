import APIClient from "./apiClient"

export interface Contratante {
    idcontratante: string;
    idtipkar: number;
    kardex: string;
    condicion: string;
    firma: string;
    fechafirma: string;
    cliente: string;
}

interface Props {
    byKardex?: boolean;
}

const getContratantesService = ({ byKardex }: Props) => {
    let url = '/contratantes/';
    if (byKardex) {
        url += 'by_kardex/';
    }
    return new APIClient<Contratante, Contratante>(url);
}

export default getContratantesService