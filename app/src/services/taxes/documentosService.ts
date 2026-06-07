import TaxesClient from "./taxesCliente"

export interface Documento {
    id_documento: number
    descripcion: string
    abreviatura: string | null
}

export const documentosService = new TaxesClient<Documento[]>("/documentos/")

export default documentosService
