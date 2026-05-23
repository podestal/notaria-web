import moment from "moment"
import type { KardexRO } from "../api/kardexService"
import uifAxios from "./uifClient"
import type {
    UifErrorsApiPage,
    UifErrorsType,
    UifRegistroPage,
    UifRegistroSummary,
    UifReportPolicy,
    UifTabId,
} from "./uifTypes"

export type {
    UifErrorsType,
    UifRegistroPage,
    UifReportPolicy,
    UifRegistroSummary,
    UifTabId,
} from "./uifTypes"

export const UIF_PAGE_SIZE = 10

export const uifTabToErrorsType: Record<UifTabId, UifErrorsType> = {
    errors: "errors",
    ro: "ro",
    not_ro: "no_envian",
}

export interface UifDateRangeParams {
    initialDate: string
    finalDate: string
}

export const formatUifDateParam = (date: Date): string =>
    moment(date).format("DD/MM/YYYY")

export const buildUifDateParams = (
    dateFrom?: Date,
    dateTo?: Date
): UifDateRangeParams | null => {
    if (!dateFrom || !dateTo) return null
    return {
        initialDate: formatUifDateParam(dateFrom),
        finalDate: formatUifDateParam(dateTo),
    }
}

const authHeaders = (access: string) => ({
    Authorization: `JWT ${access}`,
})

const isUifErrorsApiPage = (data: unknown): data is UifErrorsApiPage => {
    if (!data || typeof data !== "object") return false
    const record = data as Record<string, unknown>
    return record.results != null && typeof record.results === "object"
}

const buildUifErrorsParams = (
    dates: UifDateRangeParams,
    type: UifErrorsType,
    page: number
): URLSearchParams => {
    const params = new URLSearchParams()
    params.append("initialDate", dates.initialDate)
    params.append("finalDate", dates.finalDate)
    params.append("type", type)
    params.append("page", String(page))
    return params
}

const emptySummary = (): UifRegistroSummary => ({
    total_kardex: 0,
    total_errors: 0,
    error_breakdown: {},
})

const mapUifApiPageToRegistro = (
    apiPage: UifErrorsApiPage,
    type: UifErrorsType
): UifRegistroPage => {
    const apiResults = apiPage.results
    const summary = apiResults.summary ?? emptySummary()
    const metadata = apiResults.metadata ?? { processed_at: new Date().toISOString() }

    const results: KardexRO = {
        lista_errores: type === "errors" ? (apiResults.lista_errores ?? []) : [],
        lista_kardex_ro: type === "ro" ? (apiResults.lista_kardex_ro ?? []) : [],
        lista_kardex_no_envian: type === "no_envian" ? (apiResults.lista_kardex_no_envian ?? []) : [],
        summary: {
            total_kardex: summary.total_kardex,
            total_errors: summary.total_errors,
            error_breakdown: summary.error_breakdown ?? {},
        },
        metadata: {
            processed_at: metadata.processed_at ?? new Date().toISOString(),
            list_type: metadata.list_type ?? type,
        },
    }

    return {
        count: apiPage.count,
        next: apiPage.next,
        previous: apiPage.previous,
        results,
    }
}

export const fetchUifRegistro = async (
    access: string,
    dateFrom: Date,
    dateTo: Date,
    type: UifErrorsType,
    page: number
): Promise<UifRegistroPage> => {
    const dates = buildUifDateParams(dateFrom, dateTo)
    if (!dates) {
        throw new Error("Se requiere rango de fechas")
    }

    const { data } = await uifAxios.get<unknown>("errors/", {
        headers: authHeaders(access),
        params: buildUifErrorsParams(dates, type, page),
    })

    if (!isUifErrorsApiPage(data)) {
        throw new Error(`Respuesta UIF inválida (type=${type})`)
    }

    return mapUifApiPageToRegistro(data, type)
}

export const downloadUifExcelReport = async (
    access: string,
    dateFrom: Date,
    dateTo: Date,
    reportPolicy: UifReportPolicy
): Promise<ArrayBuffer> => {
    const dates = buildUifDateParams(dateFrom, dateTo)
    if (!dates) throw new Error("Se requiere rango de fechas")

    const { data } = await uifAxios.get<ArrayBuffer>("reports/excel/", {
        headers: authHeaders(access),
        params: { ...dates, reportPolicy },
        responseType: "arraybuffer",
    })
    return data
}

export const downloadUifPlaneReport = async (
    access: string,
    dateFrom: Date,
    dateTo: Date,
    reportPolicy: UifReportPolicy
): Promise<Blob> => {
    const dates = buildUifDateParams(dateFrom, dateTo)
    if (!dates) throw new Error("Se requiere rango de fechas")

    const { data, headers } = await uifAxios.get<Blob | { filename?: string; content?: string }>(
        "reports/plane/",
        {
            headers: authHeaders(access),
            params: { ...dates, reportPolicy, responseFormat: "file" },
            responseType: "blob",
        }
    )

    if (data instanceof Blob) {
        return data
    }

    if (data && typeof data === "object" && "content" in data && data.content) {
        const binary = atob(data.content)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i)
        }
        return new Blob([bytes], { type: "text/plain" })
    }

    const contentType = headers["content-type"] || "text/plain"
    return new Blob([data as BlobPart], { type: contentType })
}
