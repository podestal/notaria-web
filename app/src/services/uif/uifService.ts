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

const parseFilenameFromContentDisposition = (header: string | undefined): string | null => {
    if (!header) return null
    const utf8 = /filename\*=UTF-8''([^;\s]+)/i.exec(header)
    if (utf8?.[1]) {
        try {
            return decodeURIComponent(utf8[1].replace(/(^")|("$)/g, ""))
        } catch {
            return utf8[1]
        }
    }
    const quoted = /filename="([^"]+)"/i.exec(header)
    if (quoted?.[1]) return quoted[1]
    const plain = /filename=([^;\s]+)/i.exec(header)
    if (plain?.[1]) return plain[1].replace(/^["']|["']$/g, "")
    return null
}

const sanitizeDownloadFilename = (name: string): string =>
    name.trim().replace(/[/\\?%*:|"<>]/g, "-")

export interface UifPlaneDownload {
    blob: Blob
    filename: string
}

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
): Promise<UifPlaneDownload> => {
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

    const fromHeader = parseFilenameFromContentDisposition(
        headers["content-disposition"]
    )

    const resolveFilename = (bodyFilename?: string): string => {
        const candidate = bodyFilename?.trim() || fromHeader
        if (candidate) return sanitizeDownloadFilename(candidate)
        return `registro_uif_${dates.initialDate.replace(/\//g, "-")}_${dates.finalDate.replace(/\//g, "-")}.txt`
    }

    const blobFromBase64Content = (
        content: string,
        bodyFilename?: string
    ): UifPlaneDownload => {
        const binary = atob(content)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i)
        }
        return {
            blob: new Blob([bytes], { type: "text/plain" }),
            filename: resolveFilename(bodyFilename),
        }
    }

    if (data instanceof Blob) {
        const contentType = headers["content-type"] ?? ""
        if (contentType.includes("json")) {
            try {
                const text = await data.text()
                const json = JSON.parse(text) as { filename?: string; content?: string }
                if (json.content) {
                    return blobFromBase64Content(
                        json.content,
                        typeof json.filename === "string" ? json.filename : undefined
                    )
                }
            } catch {
                /* use raw blob below */
            }
        }

        return {
            blob: data,
            filename: resolveFilename(),
        }
    }

    if (data && typeof data === "object" && "content" in data && data.content) {
        return blobFromBase64Content(
            data.content,
            typeof data.filename === "string" ? data.filename : undefined
        )
    }

    const contentType = headers["content-type"] || "text/plain"
    return {
        blob: new Blob([data as BlobPart], { type: contentType }),
        filename: resolveFilename(),
    }
}
