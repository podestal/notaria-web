import type { Catalog, CreateUpdateCatalog } from "../../../services/taxes/catalogService"

export interface CatalogoFormValues {
    id_codigo_unitario: number
    codigo: string
    descripcion: string
    tipo_igv_id: number
    moneda_id: number
    valor_unitario: string
    precio_unitario: string
}

export const CATALOGO_TIPO_IGV_OPTIONS = [
    { value: 1, label: "Gravado — operación onerosa (10)" },
    { value: 2, label: "Exonerado (20)" },
    { value: 3, label: "Inafecto (30)" },
    { value: 4, label: "Exportación (40)" },
]

export const CATALOGO_MONEDA_OPTIONS = [
    { value: 1, label: "Soles (PEN)" },
    { value: 2, label: "Dólares (USD)" },
]

export const emptyCatalogoFormValues: CatalogoFormValues = {
    id_codigo_unitario: 0,
    codigo: "",
    descripcion: "",
    tipo_igv_id: 1,
    moneda_id: 1,
    valor_unitario: "",
    precio_unitario: "",
}

export const catalogToFormValues = (catalog: Catalog): CatalogoFormValues => ({
    id_codigo_unitario: catalog.id_codigo_unitario || 0,
    codigo: catalog.codigo || "",
    descripcion: catalog.descripcion || "",
    tipo_igv_id: catalog.tipo_igv_id || 1,
    moneda_id: catalog.moneda_id || 1,
    valor_unitario: catalog.valor_unitario || "",
    precio_unitario: catalog.precio_unitario || "",
})

export const formValuesToCatalogPayload = (
    values: CatalogoFormValues,
): CreateUpdateCatalog => ({
    codigo: values.codigo.trim(),
    descripcion: values.descripcion.trim(),
    id_codigo_unitario: values.id_codigo_unitario,
    tipo_igv_id: values.tipo_igv_id,
    moneda_id: values.moneda_id,
    valor_unitario: values.valor_unitario.trim(),
    precio_unitario: values.precio_unitario.trim(),
})

export const getCatalogBackendError = (error: unknown): string => {
    const data = (error as { response?: { data?: Record<string, unknown> } })
        ?.response?.data
    if (!data) {
        return error instanceof Error
            ? error.message
            : "No se pudo completar la operación."
    }
    if (typeof data.detail === "string") return data.detail
    if (typeof data.message === "string") return data.message
    const first = Object.values(data).find((v) => typeof v === "string")
    if (typeof first === "string") return first
    const firstArr = Object.values(data).find((v) => Array.isArray(v))
    if (Array.isArray(firstArr) && typeof firstArr[0] === "string") {
        return firstArr[0]
    }
    return "No se pudo completar la operación."
}
