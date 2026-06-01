import SisgenClient from "./sisgenClient"

export interface SisgenSendDocumentItem {
    kardex: string
    idkardex: string
}

export interface SisgenSendDocumentsRequest {
    documents: SisgenSendDocumentItem[]
}

export interface SisgenSendDocumentsResponse {
    error: number
    messageDescription?: string
    message?: string
    guardados?: number
    fallidos?: number
    observados?: number
    processed_kardex?: string[]
    data?: unknown[]
    errores_sisgen_usuario?: string[]
    dry_run?: boolean
}

/** @deprecated Legacy single/batch payload; prefer SisgenSendDocumentsRequest without `all`. */
export interface SisgenRequest {
    all?: number
    documents: SisgenSendDocumentItem[]
}

export interface SisgenDoc {
    idkardex: string
    kardex: string
    numescritura: string
    fechaescritura: string
    estado_sisgen: string
    idtipkar: number
    fechaingreso: string
    codactos: string
    contrato: string
    folioini: string
    foliofin: string
    fechaconclusion: string
    cod_ancert: string
    actouif: string
    actosunat: string
    notary_data: {
        codnotario: string
        codoficial: string
        coduif: string
        nombre_notario: string
        direccion: string
        distrito: string
        provincia: string
        departamento: string
    }
}

/** @deprecated Legacy response shape */
export interface SisgenResponse {
    error: number
    data: SisgenDoc[]
    total: number
}

const sendClient = new SisgenClient<
    SisgenSendDocumentsResponse,
    SisgenSendDocumentsRequest
>("send-sisgen/")

export const postSisgenSendDocuments = (
    body: SisgenSendDocumentsRequest,
    access: string,
) => sendClient.post(body, access)

export default sendClient
