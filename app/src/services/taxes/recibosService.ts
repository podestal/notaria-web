import TaxesClient from "./taxesCliente"
import taxesHttp from "./taxesHttpClient"
import { authHeaderValue } from "../http/attachAxiosAuthRequestInterceptor"
import type { SunatStatus } from "./sunatStatus"

export const RECIBO_COMPROBANTE_FACTURA = 1
export const RECIBO_COMPROBANTE_BOLETA = 2
export const RECIBO_COMPROBANTE_NOTA_CREDITO = 3
export const RECIBO_COMPROBANTE_NOTA_DEBITO = 4

export interface Recibo {
    id_recibo: number
    fecha_emision: string
    comprobante: number
    serie: string
    numero: number
    moneda: string
    gravada: string
    igv: string
    total: string
    persona_documento: string
    persona_nombres: string
    kardex: string | null
    usuario: string
    anulada: boolean
    enviada_sunat: boolean
    aceptada_sunat: boolean
    error_sunat?: string | null
    motivo_baja: string | null
    fecha_baja: string | null
    resumen_id: number | null
}

export interface ReciboLinea {
    id?: number
    catalogo_id: number
    cantidad: number
    descripcion: string
    total: string
}

export interface CreateReciboResponse {
    recibo: Recibo
    items: ReciboLinea[]
    sunat?: SunatStatus
}

export interface EnviarReciboSunatResponse extends SunatStatus {
    recibo: Recibo
}

export interface RecibosPage {
    count: number
    next: string | null
    previous: string | null
    results: Recibo[]
}

export interface AnularReciboPayload {
    motivo_baja: string
}

export interface ReciboLineaPayload {
    catalogo_id: number
    cantidad: number
    descripcion: string
    total: string
}

export interface CreateUpdateRecibo {
    serie: string
    moneda_id: number
    persona_id: number
    direccion: string
    fecha_emision: string
    kardex?: string
    lineas: ReciboLineaPayload[]
}

export const getReciboPdfPath = (id_recibo: number) => `/recibos/${id_recibo}/pdf/`

export const fetchReciboPdfBlob = async (
    id_recibo: number,
    access: string,
): Promise<Blob> => {
    const response = await taxesHttp.get(getReciboPdfPath(id_recibo), {
        responseType: "blob",
        headers: { Authorization: authHeaderValue(access) },
    })
    return new Blob([response.data], { type: "application/pdf" })
}

export const getReciboAnularService = (id_recibo: number) =>
    new TaxesClient<Recibo, AnularReciboPayload>(`/recibos/${id_recibo}/anular/`)

export const getReciboEnviarSunatService = (id_recibo: number) =>
    new TaxesClient<EnviarReciboSunatResponse, Record<string, never>>(
        `/recibos/${id_recibo}/enviar-sunat/`,
    )

export const recibosService = new TaxesClient<RecibosPage>("/recibos/")

export const getRecibosServiceSingle = (id_recibo?: number) =>
    new TaxesClient<CreateReciboResponse | Recibo, CreateUpdateRecibo>(
        id_recibo ? `/recibos/${id_recibo}/` : "/recibos/",
    )

export const getRecibosCreateService = () =>
    new TaxesClient<CreateReciboResponse, CreateUpdateRecibo>("/recibos/")

export default recibosService
