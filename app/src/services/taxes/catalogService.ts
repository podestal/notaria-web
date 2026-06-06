import TaxesClient from "./taxesCliente"

export interface Catalog {
    id_catalogo: number
    codigo: string
    descripcion: string
    valor_unitario: string
    precio_unitario: string
    creado: string
    actualizado: string
    negocio_id: number
    usuario_id: number
    moneda_id: number
    id_codigo_unitario: number
    codigo_unitario?: string
    tipo_igv_id: number
}

export interface CatalogPage {
    count: number
    next: string | null
    previous: string | null
    results: Catalog[]
}

export interface CreateUpdateCatalog {
    codigo: string
    descripcion: string
    id_codigo_unitario: number
    tipo_igv_id: number
    moneda_id: number
    valor_unitario: string
    precio_unitario: string
}

export const getCatalogServiceSingle = (id_catalogo?: number) =>
    new TaxesClient<Catalog, CreateUpdateCatalog>(
        id_catalogo ? `/catalogos/${id_catalogo}/` : "/catalogos/",
    )

export const catalogService = new TaxesClient<CatalogPage, CreateUpdateCatalog>(
    "/catalogos/",
)

export default catalogService
