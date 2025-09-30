import APIClient from "./apiClient";

export interface Kardex {
    idkardex: number;
    kardex: string;
    contrato: string;
    fechaingreso: string;
    fechaescritura: string;
    numescritura: string;
    numminuta?: string;
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
    papeltrasladoini?: string;
    papeltrasladofin?: string;
    recepcion?: string;
    estado_sisgen?: number;
}

export interface KardexPage {
    count: number;
    next: string | null;
    previous: string | null;
    results: Kardex[];
}
export interface KardexError {
    idkardex: number
    kardex: string
    act: string
    status: string
    error_type: string
    error_description: string
}

export interface KardexROValid {
    idkardex: number
    kardex: string
    act: string
    tipo_moneda: string
    tipo_cambio: number
    patrimonial: number
    en_dolares: number
    // Additional fields that might be useful
    codacto: string
    uif_code: string
    fecha_conclusion: string
    tipo_instrumento: string
}

export interface KardexNoEnvian {
    idkardex: number
    kardex: string
    act: string
    tipo_moneda: string
    patrimonial: number
    status: string
    reason: string
}

export interface KardexRO {
    lista_errores: KardexError[]
    lista_kardex_ro: KardexROValid[]
    lista_kardex_no_envian: KardexNoEnvian[]
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