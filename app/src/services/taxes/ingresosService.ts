import TaxesClient from "./taxesCliente"
import taxesHttp from "./taxesHttpClient"
import { authHeaderValue } from "../http/attachAxiosAuthRequestInterceptor"

export const getIngresoPdfPath = (id_ingreso: number) =>
    `/ingresos/${id_ingreso}/pdf/`

export const fetchIngresoPdfBlob = async (
    id_ingreso: number,
    access: string,
): Promise<Blob> => {
    const response = await taxesHttp.get(getIngresoPdfPath(id_ingreso), {
        responseType: "blob",
        headers: { Authorization: authHeaderValue(access) },
    })
    return new Blob([response.data], { type: "application/pdf" })
}

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

export interface AnularIngresoPayload {
    motivo_baja: string
}

export interface CanjearIngresoPayload {
    serie: string
    comprobante_id: number
    observaciones: string
    fecha_emision: string
}

export type CanjeComprobanteTipo = "boleta" | "factura"

export const CANJE_COMPROBANTE_OPTIONS: Record<
    CanjeComprobanteTipo,
    { comprobante_id: number; serie: string; label: string; description: string }
> = {
    boleta: {
        comprobante_id: 2,
        serie: "B001",
        label: "Boleta",
        description: "Serie B001",
    },
    factura: {
        comprobante_id: 1,
        serie: "F001",
        label: "Factura",
        description: "Serie F001",
    },
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

export const getIngresoAnularService = (id_ingreso: number) =>
    new TaxesClient<Ingreso, AnularIngresoPayload>(
        `/ingresos/${id_ingreso}/anular/`,
    )

export const getIngresoCanjearService = (id_ingreso: number) =>
    new TaxesClient<Ingreso, CanjearIngresoPayload>(
        `/ingresos/${id_ingreso}/canjear/`,
    )

export const controlInternoIngresosService = new TaxesClient<
    Ingreso,
    CreateUpdateIngreso
>("/ingresos/control-interno/")

export const ingresosService = new TaxesClient<IngresosPage, CreateUpdateIngreso>(
    "/ingresos/",
)

export default ingresosService
