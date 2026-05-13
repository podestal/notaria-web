import APIClient from "../apiClient"

export interface Acto {
    idtipoacto: string
    actosunat: string
    actouif: string
    idtipkar: number
    desacto: string
    umbral: number
    impuestos: number
    idcalnot: number
    idecalreg: number
    idmodelo: number
    rol_part: string
    indicador: string
    codigo_ancert: string
    codigo_visual: string
    tipobien_admitido: string
    mediospago: string
    cuantia: string
    origenfondo: string
    oporpago1: string
    impuestorenta: string
    tipoplantilla_default: string
    nativo: string
    novalidapatri: string
    flag: string
    cod_ancert: string
}

export interface ActoPage {
    count: number
    next: string | null
    previous: string | null
    results: Acto[]
}

export const getActoService = () => {
    return new APIClient<ActoPage>('/tiposdeacto/')
}