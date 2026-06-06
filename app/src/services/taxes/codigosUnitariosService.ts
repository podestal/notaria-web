import TaxesClient from "./taxesCliente"

export interface CodigosUnitarios {
    id_codigo_unitario: number
    codigo: string
    descripcion: string
}

export const codigosUnitariosService = new TaxesClient<CodigosUnitarios[]>(
    "/codigos-unitarios/",
)