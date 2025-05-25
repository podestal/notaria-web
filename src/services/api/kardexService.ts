import APIClient from "./apiClient";

export interface Kardex {
    idkardex: number;
    kardex: string;
    contrato: string;
    fechaingreso: string;
    fechaescritura: string;
    numescritura: string;
    numminuta: string;
    folioini: string;
    foliofin: string;
    numinstrmento: string;
    txa_minuta: string;
    idusuario: number;
    usuario: string;
    idtipkar: number;
    cliente: string;
}

export interface KardexPage {
    count: number;
    next: string | null;
    previous: string | null;
    results: Kardex[];
}

interface Props {
    id?: number
    byCorrelative?: boolean
    byDocument?: boolean
    byName?: boolean

}

const getKardexService =({ id, byCorrelative, byDocument, byName }: Props) => {

    let url = '/kardex/'
    if (id) {
        url += `${id}/`
    } else if (byCorrelative) {
        url += 'kardex_by_correlative/'
    } else if (byDocument) {
        url += 'by_document/'
    } else if (byName) {
        url += 'by_name/'
    }

    return new APIClient<KardexPage, KardexPage>(url)
}

export default getKardexService