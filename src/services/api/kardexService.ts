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
    fktemplate: number;
    papelini: string;
    papelfin: string;
    responsable: number;
    referencia: string;
}

export interface KardexPage {
    count: number;
    next: string | null;
    previous: string | null;
    results: Kardex[];
}

export interface KardexROError {
    idkardex: number
    kardex: string
    idtipkar: number
    tipo_instrumento: string
    codacto: string
    numescritura: string
    fechaescritura: string
    fechaconclusion: string
    tipo: string
    act: string
    uif_code: string
    status: string
    error_type: string
    error_description: string
}

export interface KardexRO {
    errors: KardexROError[]
    summary: {
        total_kardex: number
        total_errors: number
        error_breakdown: {
            [key: string]: number
        }
    }
    metadata: {
        processed_at: string
        list_type: string
    }
}

export interface KardexROPage {
    count: number
    next: string | null
    previous: string | null
    results: KardexRO
}

export type CreateUpdateKardex = Omit<Kardex, 
    'kardex' |
    'idkardex' | 
    'usuario' | 
    'cliente' | 
    'numminuta' | 
    'numinstrmento' |
    'txa_minuta' |
    'cliente'> & {

    idtipkar: number;
    fechaingreso: string;
    idusuario: number;
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

export const getKardexROService = () => {
    let url = '/kardex/uif-errors/'
    return new APIClient<KardexROPage, KardexROPage>(url)
}

const getKardexService =() => {

    let url = '/kardex/'


    return new APIClient<KardexPage, CreateUpdateKardex>(url)
}

export default getKardexService