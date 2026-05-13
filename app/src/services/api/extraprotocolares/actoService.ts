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

/** POST crear tipo de acto (el servidor puede asignar `idtipoacto`). */
export const getActoCreateClient = () => {
    return new APIClient<Acto, Partial<Acto>>("/tiposdeacto/")
}

/** PATCH actualizar por `idtipoacto` (clave en URL). */
export const getActoDetailClient = (idtipoacto: string) => {
    const id = encodeURIComponent(idtipoacto.trim())
    return new APIClient<Acto, Partial<Acto>>(`/tiposdeacto/${id}/`)
}