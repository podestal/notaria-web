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
    return (
        error.mensaje_usuario
        || error.mensaje_tecnico
        || error.estado
        || JSON.stringify(error)
    )
}
