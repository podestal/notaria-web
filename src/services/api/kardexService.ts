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
    codactos: string;
}

export interface KardexPage {
    count: number;
    next: string | null;
    previous: string | null;
    results: Kardex[];
}

export type CreateUpdateKardex = Omit<Kardex, 
    'idkardex' | 
    'usuario' | 
    'fechaescritura' | 
    'cliente' | 
    'numminuta' | 
    'folioini' |
    'foliofin' |
    'numinstrmento' |
    'txa_minuta' |
    'cliente'> & {

    kardex: string;
    idtipkar: number;
    fechaingreso: string;
    referencia?: string;
    idusuario: number;
    responsable: number;
    retenido: number
    desistido: number;
    autorizado: number;
    idrecogio: number;
    pagado: number;
    visita: number;
    idnotario: number;
}


interface SingleKardexProps {
    id?: number
}

export const getSingleKardexService = ({ id }: SingleKardexProps) => {
    let url = '/kardex/';
    if (id) {
        url += `${id}/`;
    }
    return new APIClient<Kardex, CreateUpdateKardex>(url)
}

interface Props {
    id?: number
    byCorrelative?: boolean
    byDocument?: boolean
    byName?: boolean
    byNumescritura?: boolean
}

const getKardexService =({ id, byCorrelative, byDocument, byName, byNumescritura }: Props) => {

    let url = '/kardex/'
    if (id) {
        url += `${id}/`
    } else if (byCorrelative) {
        url += 'kardex_by_correlative/'
    } else if (byDocument) {
        url += 'by_document/'
    } else if (byName) {
        url += 'by_name/'
    } else if (byNumescritura) {
        url += 'by_numescritura/'
    }


    return new APIClient<KardexPage, CreateUpdateKardex>(url)
}

export default getKardexService