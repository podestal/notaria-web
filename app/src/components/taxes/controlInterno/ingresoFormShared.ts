import type { CreateUpdateIngreso, Ingreso } from "../../../services/taxes/ingresosService"
import type { SerieControlInterno } from "../../../services/taxes/seriesService"

export interface IngresoFormValues {
    id_serie: number
    moneda_id: number
    persona_id: number
    direccion: string
    observaciones: string
    total: string
    lineas: CreateUpdateIngreso["lineas"]
}

export const emptyIngresoFormValues: IngresoFormValues = {
    id_serie: 0,
    moneda_id: 0,
    persona_id: 0,
    direccion: "",
    observaciones: "",
    total: "",
    lineas: [],
}

export const resolveIngresoSerieId = (
    ingreso: Ingreso,
    series: SerieControlInterno[] = [],
): number => {
    const match = series.find((item) => item.serie === ingreso.serie)
    return match?.id_serie ?? 0
}

export const ingresoToFormValues = (
    ingreso: Ingreso,
    series: SerieControlInterno[] = [],
): IngresoFormValues => ({
    id_serie: resolveIngresoSerieId(ingreso, series),
    moneda_id: 0,
    persona_id: 0,
    direccion: ingreso.direccion || "",
    observaciones: ingreso.observaciones || "",
    total: ingreso.total || "",
    lineas: [],
})

export const formValuesToIngresoPayload = (
    values: IngresoFormValues,
): CreateUpdateIngreso => ({
    id_serie: values.id_serie,
    moneda_id: values.moneda_id,
    persona_id: values.persona_id,
    direccion: values.direccion.trim(),
    observaciones: values.observaciones.trim(),
    total: values.total.trim(),
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
