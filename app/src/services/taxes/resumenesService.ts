import TaxesClient from "./taxesCliente"
import type { Recibo, RecibosPage } from "./recibosService"
import type { SunatStatus } from "./sunatStatus"

export interface Resumen {
    id_resumen: number
    fecha_resumen: string
    fecha_emision: string
    lote: number
    cantidad: number
    usuario: string
    ticket_sunat: string | null
    denominacion: string | null
    enviada_sunat: boolean
    aceptada_sunat: boolean
    error_sunat?: string | null
}

export interface ResumenesPage {
    count: number
    next: string | null
    previous: string | null
    results: Resumen[]
}

export interface CreateResumenPayload {
    fecha_comunicacion: string
    fecha_emision: string
    comprobante_id: number
    recibo_ids: number[]
}

export interface CreateResumenResponse {
    resumen: Resumen
    recibos: Recibo[]
    sunat?: SunatStatus
}

export const resumenesService = new TaxesClient<ResumenesPage>("/resumenes/")

export const resumenesCreateService = new TaxesClient<
    CreateResumenResponse,
    CreateResumenPayload
>("/resumenes/")

export const resumenesRecibosPendientesService = new TaxesClient<
    Recibo[] | RecibosPage
>("/resumenes/recibos-pendientes/")

export const getResumenConsultarTicketService = (id_resumen: number) =>
    new TaxesClient<Resumen>(`/resumenes/${id_resumen}/consultar-ticket/`)

export default resumenesService
