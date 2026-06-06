import TaxesClient from "./taxesCliente"

export interface TipoIgv {
    id_tipo_igv: number
    codigo: string
    descripcion: string
    onerosa: boolean
    creado: string | null
    actualizado: string | null
}

export const tiposIgvService = new TaxesClient<TipoIgv[]>("/tipos-igv/")
