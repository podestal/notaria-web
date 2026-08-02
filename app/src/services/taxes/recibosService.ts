import TaxesClient from "./taxesCliente"
import taxesHttp from "./taxesHttpClient"
import { authHeaderValue } from "../http/attachAxiosAuthRequestInterceptor"
import type { SunatStatus } from "./sunatStatus"

export const RECIBO_COMPROBANTE_FACTURA = 1
export const RECIBO_COMPROBANTE_BOLETA = 2
export const RECIBO_COMPROBANTE_NOTA_CREDITO = 3
export const RECIBO_COMPROBANTE_NOTA_DEBITO = 4

export interface Recibo {
    id_recibo: number
    fecha_emision: string
    comprobante: number
    serie: string
    numero: number
    moneda: string
    gravada: string
    igv: string
    total: string
    persona_documento: string
    persona_nombres: string
    direccion?: string | null
    observaciones?: string | null
    kardex: string | null
    usuario: string
    anulada: boolean
    enviada_sunat: boolean
    aceptada_sunat: boolean
    error_sunat?: string | null
    motivo_baja: string | null
    fecha_baja: string | null
    resumen_id: number | null
}

/** Line item from create response (minimal). */
export interface ReciboLinea {
    id?: number
    catalogo_id: number
    cantidad: number
    descripcion: string
    total: string
    precio_unitario?: string
    detalles?: string | null
}

/** Full item from GET /items-recibos/?recibo_id= */
export interface ItemRecibo {
    id_item: number
    cantidad: number
    descripcion: string | null
    valor_unitario: string | null
    precio_unitario: string
    subtotal: string
    igv: string
    total: string
    recibo: number
    catalogo_id: number
    tipo_igv: number | null
    detalles: string | null
}

export interface ItemsRecibosPage {
    count: number
    next: string | null
    previous: string | null
    results: ItemRecibo[]
}

export interface CreateReciboResponse {
    recibo: Recibo
    items: ItemRecibo[] | ReciboLinea[]
    sunat?: SunatStatus
}

export interface EnviarReciboSunatResponse extends SunatStatus {
    recibo: Recibo
}

export interface RecibosPage {
    count: number
    next: string | null
    previous: string | null
    results: Recibo[]
}

export interface AnularReciboPayload {
    motivo_baja: string
}

export interface ReciboLineaPayload {
    catalogo_id: number
    cantidad: number
    descripcion: string
    total: string
}

export interface CreateUpdateRecibo {
    serie: string
    moneda_id: number
    persona_id: number
    direccion: string
    fecha_emision: string
    kardex?: string
    /** Factura/boleta que esta nota modifica */
    recibo_modifica?: number
    lineas: ReciboLineaPayload[]
}

export interface ReciboDetail {
    recibo: Recibo
    items: ItemRecibo[]
}

export const getReciboPdfPath = (id_recibo: number) => `/recibos/${id_recibo}/pdf/`

export const fetchReciboPdfBlob = async (
    id_recibo: number,
    access: string,
): Promise<Blob> => {
    const response = await taxesHttp.get(getReciboPdfPath(id_recibo), {
        responseType: "blob",
        headers: { Authorization: authHeaderValue(access) },
    })
    return new Blob([response.data], { type: "application/pdf" })
}

export const getReciboAnularService = (id_recibo: number) =>
    new TaxesClient<Recibo, AnularReciboPayload>(`/recibos/${id_recibo}/anular/`)

export const getReciboEnviarSunatService = (id_recibo: number) =>
    new TaxesClient<EnviarReciboSunatResponse, Record<string, never>>(
        `/recibos/${id_recibo}/enviar-sunat/`,
    )

export const recibosService = new TaxesClient<RecibosPage>("/recibos/")

export interface RecibosModificablesFilters {
    page?: number
    page_size?: number
    /** 1 = factura, 2 = boleta */
    comprobante_id?: string
    serie?: string
    numero?: string
    aceptada_sunat?: string
    fecha_emision_desde?: string
    fecha_emision_hasta?: string
    kardex?: string
    has_kardex?: string
    persona_documento?: string
    persona_nombres?: string
    usuario?: string
}

export const getRecibosModificablesService = () =>
    new TaxesClient<RecibosPage>("/recibos/modificables/")

export const getRecibosModificables = async (
    access: string,
    filters: RecibosModificablesFilters = {},
): Promise<RecibosPage> => {
    const params: Record<string, string> = {}
    if (filters.page != null) params.page = String(filters.page)
    if (filters.page_size != null) params.page_size = String(filters.page_size)

    const comprobante = filters.comprobante_id?.trim()
    if (comprobante) {
        params.comprobante_id = comprobante
        params.comprobante = comprobante
    }
    if (filters.serie?.trim()) params.serie = filters.serie.trim()
    if (filters.numero?.trim()) params.numero = filters.numero.trim()
    if (filters.aceptada_sunat?.trim()) {
        params.aceptada_sunat = filters.aceptada_sunat.trim()
    }
    if (filters.fecha_emision_desde?.trim()) {
        params.fecha_emision_desde = filters.fecha_emision_desde.trim()
    }
    if (filters.fecha_emision_hasta?.trim()) {
        params.fecha_emision_hasta = filters.fecha_emision_hasta.trim()
    }
    if (filters.kardex?.trim()) params.kardex = filters.kardex.trim()
    if (filters.has_kardex?.trim()) params.has_kardex = filters.has_kardex.trim()
    if (filters.persona_documento?.trim()) {
        params.persona_documento = filters.persona_documento.trim()
    }
    if (filters.persona_nombres?.trim()) {
        params.persona_nombres = filters.persona_nombres.trim()
    }
    if (filters.usuario?.trim()) params.usuario = filters.usuario.trim()

    const data = (await getRecibosModificablesService().get(
        access,
        params,
    )) as RecibosPage | Recibo[]

    if (Array.isArray(data)) {
        return {
            count: data.length,
            next: null,
            previous: null,
            results: data,
        }
    }

    return {
        count: data?.count ?? data?.results?.length ?? 0,
        next: data?.next ?? null,
        previous: data?.previous ?? null,
        results: data?.results ?? [],
    }
}

export const getRecibosServiceSingle = (id_recibo?: number) =>
    new TaxesClient<CreateReciboResponse | Recibo, CreateUpdateRecibo>(
        id_recibo ? `/recibos/${id_recibo}/` : "/recibos/",
    )

export const getItemsRecibosService = () =>
    new TaxesClient<ItemsRecibosPage | ItemRecibo[]>("/items-recibos/")

export const getItemsRecibosByReciboId = async (
    access: string,
    recibo_id: number,
): Promise<ItemRecibo[]> => {
    const data = await getItemsRecibosService().get(access, {
        recibo_id: String(recibo_id),
        page_size: "200",
    })

    if (Array.isArray(data)) {
        return [...data].sort((a, b) => a.id_item - b.id_item)
    }
    return [...(data?.results ?? [])].sort((a, b) => a.id_item - b.id_item)
}

const normalizeReciboPayload = (
    data: CreateReciboResponse | Recibo,
): Recibo => {
    if (data && typeof data === "object" && "recibo" in data) {
        return (data as CreateReciboResponse).recibo
    }
    return data as Recibo
}

export const getReciboDetail = async (
    access: string,
    id_recibo: number,
): Promise<ReciboDetail> => {
    const [reciboPayload, items] = await Promise.all([
        getRecibosServiceSingle(id_recibo).get(access),
        getItemsRecibosByReciboId(access, id_recibo),
    ])

    return {
        recibo: normalizeReciboPayload(reciboPayload),
        items,
    }
}

export const getRecibosCreateService = () =>
    new TaxesClient<CreateReciboResponse, CreateUpdateRecibo>("/recibos/")

export default recibosService
