export interface SisgenSubmissionErrorObject {
    kardex?: string
    estado?: string
    mensaje_usuario?: string
    mensaje_tecnico?: string
    nota_contacto_it?: string
    batch?: number
    http_status?: number
    soap_return_status?: string
}

export type SisgenSubmissionError = string | SisgenSubmissionErrorObject

export const isSisgenSubmissionErrorObject = (
    error: SisgenSubmissionError,
): error is SisgenSubmissionErrorObject =>
    typeof error === "object" && error !== null && !Array.isArray(error)

export const normalizeSisgenSubmissionErrors = (
    errors: unknown,
): SisgenSubmissionError[] => {
    if (!errors) return []
    if (Array.isArray(errors)) return errors as SisgenSubmissionError[]
    if (typeof errors === "string") return [errors]
    if (typeof errors === "object") return [errors as SisgenSubmissionErrorObject]
    return []
}

export const formatSisgenSubmissionError = (error: SisgenSubmissionError): string => {
    if (typeof error === "string") return error
    const kardexPrefix = error.kardex ? `${error.kardex}: ` : ""
    const body =
        error.mensaje_usuario
        || error.mensaje_tecnico
        || error.estado
        || JSON.stringify(error)
    return `${kardexPrefix}${body}`
}

/** Strip leading "K27-2026: " style prefix so batch-level duplicates collapse. */
export const sisgenErrorDedupeKey = (error: SisgenSubmissionError): string => {
    if (isSisgenSubmissionErrorObject(error)) {
        return [
            error.mensaje_usuario ?? "",
            error.mensaje_tecnico ?? "",
            error.estado ?? "",
            error.soap_return_status ?? "",
        ].join("|")
    }
    return error.replace(/^[A-Z]\d+-\d+:\s*/, "")
}

export const dedupeSisgenSubmissionErrors = (
    errors: SisgenSubmissionError[],
): SisgenSubmissionError[] => {
    const seen = new Set<string>()
    const result: SisgenSubmissionError[] = []

    for (const error of errors) {
        const key = sisgenErrorDedupeKey(error)
        if (!key || seen.has(key)) continue
        seen.add(key)
        result.push(error)
    }

    return result
}

export interface SisgenSendErrorSummary {
    kardex: string
    message: string
}

interface JobDocumentLike {
    kardex: string
    status: string
    message?: string | null
}

/**
 * Prefer per-kardex job `documents[]` (accurate) over `errores_sisgen_usuario`
 * (often repeats the same batch SOAP message once per kardex in the batch).
 */
export const summarizeSisgenSendErrors = (
    jobDocuments: JobDocumentLike[],
    apiErrors: unknown,
): SisgenSendErrorSummary[] => {
    const failedFromJob = jobDocuments.filter((doc) => doc.status === "failed")

    if (failedFromJob.length > 0) {
        const byKardex = new Map<string, string>()
        for (const doc of failedFromJob) {
            if (byKardex.has(doc.kardex)) continue
            byKardex.set(
                doc.kardex,
                doc.message?.trim() || "Error al enviar a SISGEN.",
            )
        }
        return Array.from(byKardex, ([kardex, message]) => ({ kardex, message }))
    }

    return dedupeSisgenSubmissionErrors(normalizeSisgenSubmissionErrors(apiErrors)).map(
        (error) => ({
            kardex: isSisgenSubmissionErrorObject(error) ? (error.kardex ?? "") : "",
            message: formatSisgenSubmissionError(error),
        }),
    )
}
