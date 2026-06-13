import TaxesClient from "./taxesCliente"

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
    recibo_ids: number[]
}

export const resumenesService = new TaxesClient<ResumenesPage>("/resumenes/")

export const resumenesCreateService = new TaxesClient<Resumen, CreateResumenPayload>(
    "/resumenes/",
)

export default resumenesService
