import TaxesClient from "./taxesCliente"

export interface Ingreso {
    id_ingreso: number
    fecha_emision: string
    numero: number
    moneda: string
    total: string
    anulada: boolean
    usuario: string
    negocio_id: number
    persona_documento: string
    persona_nombres: string
    direccion: string
    motivo_baja: string | null
    fecha_baja: string | null
    recibo: string | null
    serie: string
    canjeada: boolean
    observaciones: string
}

export interface IngresosPage {
    count: number
    next: string | null
    previous: string | null
    results: Ingreso[]
}

export interface IngresoLineaPayload {
    catalogo_id: number
    cantidad: number
    descripcion: string
    detalles: string
    precio_unitario: string
    total: string
}

export interface CreateUpdateIngreso {
    id_serie: number
    serie: string
    moneda_id: number
    persona_id: number
    direccion: string
    observaciones: string
    total: string
    fecha_emision: string
    anulada: boolean
    canjeada: boolean
    lineas: IngresoLineaPayload[]
}

export const getIngresosServiceSingle = (id_ingreso?: number) =>
    new TaxesClient<Ingreso, CreateUpdateIngreso>(
        id_ingreso ? `/ingresos/${id_ingreso}/` : "/ingresos/",
    )

export const controlInternoIngresosService = new TaxesClient<
    Ingreso,
    CreateUpdateIngreso
>("/ingresos/control-interno/")

export const ingresosService = new TaxesClient<IngresosPage, CreateUpdateIngreso>(
    "/ingresos/",
)

export default ingresosService
