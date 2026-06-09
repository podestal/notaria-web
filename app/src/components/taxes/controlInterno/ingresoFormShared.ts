import { calcValorUnitarioFromPrecio } from "../catalogo/catalogoFormShared"
import type { Catalog } from "../../../services/taxes/catalogService"
import type { CreateUpdateIngreso, Ingreso } from "../../../services/taxes/ingresosService"
import type { IngresoLineaPayload } from "../../../services/taxes/ingresosService"
import type { Moneda } from "../../../services/taxes/monedaService"
import type { SerieControlInterno } from "../../../services/taxes/seriesService"

const roundMoney = (value: number) =>
    (Math.round(value * 100) / 100).toFixed(2)

export type { IngresoLineaPayload }

export interface IngresoFormValues {
    id_serie: number
    moneda_id: number
    persona_id: number
    persona_documento: string
    persona_nombre: string
    direccion: string
    observaciones: string
    total: string
    lineas: CreateUpdateIngreso["lineas"]
}

export const emptyIngresoFormValues: IngresoFormValues = {
    id_serie: 0,
    moneda_id: 0,
    persona_id: 0,
    persona_documento: "",
    persona_nombre: "",
    direccion: "",
    observaciones: "",
    total: "",
    lineas: [],
}

export const DEFAULT_SERIE = "0001"
export const DEFAULT_MONEDA = "SOLES"

const normalizeSerieCode = (serie: string) => serie.trim().padStart(4, "0")

const getMonedaCandidates = (moneda: Moneda) =>
    [moneda.descripcion, moneda.abreviatura, moneda.codigo, moneda.simbolo]
        .filter(Boolean)
        .map((item) => item.trim().toUpperCase())

export const resolveDefaultSerieId = (
    series: SerieControlInterno[] = [],
): number => {
    if (series.length === 0) return 0

    const match = series.find(
        (item) => normalizeSerieCode(item.serie) === DEFAULT_SERIE,
    )
    if (match) return match.id_serie

    return series[0]?.id_serie ?? 0
}

export const resolveSerieFromId = (
    id_serie: number,
    series: SerieControlInterno[] = [],
): string => {
    const match = series.find((item) => item.id_serie === id_serie)
    return match?.serie.trim() ?? ""
}

export const catalogToIngresoLinea = (
    catalog: Catalog,
    cantidad = 1,
): IngresoLineaPayload => {
    const qty = cantidad >= 1 ? cantidad : 1
    return updateIngresoLineaCantidad(
        {
            catalogo_id: catalog.id_catalogo,
            cantidad: qty,
            descripcion: catalog.descripcion,
            detalles: "-",
            precio_unitario: catalog.precio_unitario,
            total: "0.00",
        },
        qty,
    )
}

export const calcLineaSubtotal = (linea: IngresoLineaPayload): string => {
    const valorUnit = Number(calcValorUnitarioFromPrecio(linea.precio_unitario))
    if (Number.isNaN(valorUnit)) return "0.00"
    return roundMoney(valorUnit * linea.cantidad)
}

export const updateIngresoLineaCantidad = (
    linea: IngresoLineaPayload,
    cantidad: number,
): IngresoLineaPayload => {
    const qty = cantidad >= 1 ? cantidad : 1
    const precio = Number(linea.precio_unitario)
    const lineTotal = Number.isNaN(precio) ? 0 : precio * qty
    return {
        ...linea,
        cantidad: qty,
        total: roundMoney(lineTotal),
    }
}

export const computeIngresoGravadaFromLineas = (
    lineas: IngresoLineaPayload[],
): string => {
    const sum = lineas.reduce(
        (acc, linea) => acc + Number(calcLineaSubtotal(linea)),
        0,
    )
    return roundMoney(sum)
}

export const computeIngresoTotalFromLineas = (
    lineas: IngresoLineaPayload[],
): string => {
    const sum = lineas.reduce((acc, linea) => {
        const value = Number(linea.total)
        return acc + (Number.isNaN(value) ? 0 : value)
    }, 0)
    return roundMoney(sum)
}

export const computeIngresoIgvFromLineas = (
    lineas: IngresoLineaPayload[],
): string => {
    const total = Number(computeIngresoTotalFromLineas(lineas))
    const gravada = Number(computeIngresoGravadaFromLineas(lineas))
    if (Number.isNaN(total) || Number.isNaN(gravada)) return "0.00"
    return roundMoney(total - gravada)
}

export const resolveDefaultMonedaId = (monedas: Moneda[] = []): number => {
    if (monedas.length === 0) return 0

    const match = monedas.find((moneda) => {
        const candidates = getMonedaCandidates(moneda)
        return candidates.some(
            (item) =>
                item === DEFAULT_MONEDA ||
                item === "SOL" ||
                item === "PEN" ||
                item.includes("SOL"),
        )
    })
    if (match) return match.id_moneda

    return monedas[0]?.id_moneda ?? 0
}

export const applyIngresoFormDefaults = (
    values: IngresoFormValues,
    series: SerieControlInterno[] = [],
    monedas: Moneda[] = [],
): IngresoFormValues => ({
    ...values,
    id_serie:
        values.id_serie > 0 ? values.id_serie : resolveDefaultSerieId(series),
    moneda_id:
        values.moneda_id > 0 ? values.moneda_id : resolveDefaultMonedaId(monedas),
})

export const resolveIngresoSerieId = (
    ingreso: Ingreso,
    series: SerieControlInterno[] = [],
): number => {
    const ingresoSerie = normalizeSerieCode(ingreso.serie || "")
    const match = series.find(
        (item) => normalizeSerieCode(item.serie) === ingresoSerie,
    )
    return match?.id_serie ?? 0
}

export const resolveIngresoMonedaId = (
    ingreso: Ingreso,
    monedas: Moneda[] = [],
): number => {
    const value = ingreso.moneda.trim().toUpperCase()
    if (!value) return 0

    const match = monedas.find((moneda) => {
        const candidates = getMonedaCandidates(moneda)
        return candidates.includes(value)
    })

    return match?.id_moneda ?? 0
}

export const ingresoToFormValues = (
    ingreso: Ingreso,
    series: SerieControlInterno[] = [],
    monedas: Moneda[] = [],
): IngresoFormValues => ({
    id_serie: resolveIngresoSerieId(ingreso, series),
    moneda_id: resolveIngresoMonedaId(ingreso, monedas),
    persona_id: 0,
    persona_documento: ingreso.persona_documento || "",
    persona_nombre: ingreso.persona_nombres || "",
    direccion: ingreso.direccion || "",
    observaciones: ingreso.observaciones || "",
    total: ingreso.total || "",
    lineas: [],
})

export interface IngresoPayloadOptions {
    anulada?: boolean
    canjeada?: boolean
}

export const formValuesToIngresoPayload = (
    values: IngresoFormValues,
    series: SerieControlInterno[] = [],
    options: IngresoPayloadOptions = {},
): CreateUpdateIngreso => ({
    id_serie: values.id_serie,
    serie: resolveSerieFromId(values.id_serie, series),
    moneda_id: values.moneda_id,
    persona_id: values.persona_id,
    direccion: values.direccion.trim(),
    observaciones: values.observaciones.trim(),
    total: values.total.trim(),
    anulada: options.anulada ?? false,
    canjeada: options.canjeada ?? false,
    lineas: values.lineas,
})

export const getIngresoBackendError = (error: unknown): string => {
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
