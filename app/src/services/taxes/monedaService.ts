import TaxesClient from "./taxesCliente"

export interface Moneda {
    id_moneda: number
    codigo: string
    descripcion: string
    abreviatura: string
    simbolo: string
    creado: string | null
    actualizado: string | null
}

export const monedaService = new TaxesClient<Moneda[]>("/monedas/")
