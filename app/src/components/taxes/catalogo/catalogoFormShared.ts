import type { Catalog, CreateUpdateCatalog } from "../../../services/taxes/catalogService"
import type { CodigosUnitarios } from "../../../services/taxes/codigosUnitariosService"

const resolveTaxIgvFactor = (): number => {
    const raw = parseFloat(import.meta.env.VITE_TAX_IGV || "18")
    if (Number.isNaN(raw) || raw <= 0) return 1.18
    return raw > 10 ? 1 + raw / 100 : raw
}

const TAX_IGV_FACTOR = resolveTaxIgvFactor()

export const IGV_PERCENT_LABEL = (() => {
    const raw = parseFloat(import.meta.env.VITE_TAX_IGV || "18")
    const pct = raw > 10 ? raw : Math.round((raw - 1) * 100)
    return `IGV (${pct}%)`
})()

const roundMoney = (value: number) =>
    (Math.round(value * 100) / 100).toFixed(2)

export const calcValorUnitarioFromPrecio = (precio_unitario: string): string => {
    const precio = parseFloat(precio_unitario)
    if (!precio_unitario.trim() || Number.isNaN(precio) || TAX_IGV_FACTOR <= 0) {
        return ""
    }
    return roundMoney(precio / TAX_IGV_FACTOR)
}

export const calcIgvFromPrecio = (precio_unitario: string): string => {
    const precio = parseFloat(precio_unitario)
    const valor = parseFloat(calcValorUnitarioFromPrecio(precio_unitario))
    if (!precio_unitario.trim() || Number.isNaN(precio) || Number.isNaN(valor)) {
        return ""
    }
    return roundMoney(precio - valor)
}

export const resolveCatalogCodigoUnitarioId = (
    catalog: Catalog,
    codigos: CodigosUnitarios[] = [],
): number => {
    if (catalog.id_codigo_unitario) {
        return catalog.id_codigo_unitario
    }

    const ref = catalog.codigo_unitario
    if (!ref || codigos.length === 0) return 0

    if (typeof ref === "object" && "id_codigo_unitario" in ref) {
        return ref.id_codigo_unitario
    }

    const value = String(ref).trim()
    if (!value) return 0

    const byCode = codigos.find(
        (item) => item.codigo.toLowerCase() === value.toLowerCase(),
    )
    if (byCode) return byCode.id_codigo_unitario

    const byDescription = codigos.find(
        (item) => item.descripcion.toLowerCase() === value.toLowerCase(),
    )
    if (byDescription) return byDescription.id_codigo_unitario

    return 0
}

export interface CatalogoFormValues {
    id_codigo_unitario: number
    codigo: string
    descripcion: string
    tipo_igv_id: number
    moneda_id: number
    valor_unitario: string
    precio_unitario: string
}

export const emptyCatalogoFormValues: CatalogoFormValues = {
    id_codigo_unitario: 0,
    codigo: "",
    descripcion: "",
    tipo_igv_id: 0,
    moneda_id: 0,
    valor_unitario: "",
    precio_unitario: "",
}

export const catalogToFormValues = (catalog: Catalog): CatalogoFormValues => {
    const precio_unitario = catalog.precio_unitario || ""
    return {
        id_codigo_unitario: catalog.id_codigo_unitario || 0,
        codigo: catalog.codigo || "",
        descripcion: catalog.descripcion || "",
        tipo_igv_id: catalog.tipo_igv_id || 0,
        moneda_id: catalog.moneda_id || 0,
        precio_unitario,
        valor_unitario: calcValorUnitarioFromPrecio(precio_unitario),
    }
}

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
