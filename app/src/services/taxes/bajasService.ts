import TaxesClient from "./taxesCliente"

export interface CreateBajaPayload {
    fecha_emision: string
    comprobante_id: number
    recibo_ids: number[]
    motivo: string
}

export const bajasService = new TaxesClient<unknown, CreateBajaPayload>("/bajas/")

export default bajasService
