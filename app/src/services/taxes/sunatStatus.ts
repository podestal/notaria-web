export type SunatStatusValue = "accepted" | "sunat_down" | "rejected"

export interface SunatStatus {
    status: SunatStatusValue
    recoverable: boolean
    message?: string
    next_retry_at?: string | null
    retry_count?: number
    last_error?: string
    enviada_sunat?: boolean
    aceptada_sunat?: boolean
    cod_sunat?: string
    msj_sunat?: string
    ticket?: string
    generar?: string
    firmar?: string
    sunat_envio?: Record<string, unknown> | null
    sunat_consulta?: Record<string, unknown> | null
}

export interface SunatNotification {
    message: string
    type: "success" | "info" | "error"
}

export const formatSunatNextRetry = (nextRetryAt?: string | null) => {
    if (!nextRetryAt) return null
    try {
        return new Date(nextRetryAt).toLocaleString("es-PE", {
            dateStyle: "short",
            timeStyle: "short",
        })
    } catch {
        return nextRetryAt
    }
}

export const getSunatStatusLabel = (status: SunatStatusValue): string => {
    switch (status) {
        case "accepted":
            return "Aceptado por SUNAT"
        case "sunat_down":
            return "SUNAT no disponible"
        case "rejected":
            return "Rechazado por SUNAT"
        default:
            return "Estado SUNAT"
    }
}

export const getSunatNotification = (
    sunat: SunatStatus | undefined | null,
    successMessage: string,
): SunatNotification => {
    if (!sunat) {
        return { message: successMessage, type: "success" }
    }

    switch (sunat.status) {
        case "accepted":
            return {
                message: `${successMessage} Aceptado por SUNAT.`,
                type: "success",
            }
        case "sunat_down": {
            const retry = formatSunatNextRetry(sunat.next_retry_at)
            const base =
                sunat.message
                || "SUNAT no está disponible. El comprobante fue generado; el sistema reintentará el envío automáticamente."
            return {
                message: retry ? `${base} Próximo reintento: ${retry}.` : base,
                type: "info",
            }
        }
        case "rejected":
            return {
                message:
                    sunat.msj_sunat
                    || sunat.last_error
                    || sunat.message
                    || "SUNAT rechazó el comprobante. Revise los datos e intente nuevamente.",
                type: "error",
            }
        default:
            return { message: successMessage, type: "success" }
    }
}

export interface ReciboSunatFields {
    enviada_sunat: boolean
    aceptada_sunat: boolean
    error_sunat?: string | null
}

/** Infer display status from persisted recibo fields when no `sunat` block is present. */
export const inferSunatStatusFromRecibo = (
    recibo: ReciboSunatFields,
): SunatStatusValue | null => {
    if (recibo.aceptada_sunat) return "accepted"

    const error = recibo.error_sunat?.trim()
    if (error) {
        return recibo.enviada_sunat ? "rejected" : "sunat_down"
    }

    if (!recibo.enviada_sunat) return "sunat_down"

    return null
}

export type ResumenSunatDisplay = SunatStatusValue | "ticket_pending"

export interface ResumenSunatFields extends ReciboSunatFields {
    ticket_sunat?: string | null
}

export const inferSunatDisplayFromResumen = (
    resumen: ResumenSunatFields,
): ResumenSunatDisplay | null => {
    if (resumen.aceptada_sunat) return "accepted"

    const error = resumen.error_sunat?.trim()
    if (error) {
        return resumen.enviada_sunat ? "rejected" : "sunat_down"
    }

    if (resumen.enviada_sunat && !resumen.aceptada_sunat) {
        return "ticket_pending"
    }

    if (!resumen.enviada_sunat) return "sunat_down"

    return null
}

export const getResumenSunatLabel = (display: ResumenSunatDisplay): string => {
    if (display === "ticket_pending") return "Pendiente ticket SUNAT"
    return getSunatStatusLabel(display)
}

export const reciboUsesDirectSunat = (comprobante: number) =>
    comprobante !== 2

export const getSunatDetailMessage = (
    sunat?: SunatStatus | null,
    recibo?: ReciboSunatFields | null,
): string | null => {
    if (sunat?.message) return sunat.message
    if (sunat?.msj_sunat) return sunat.msj_sunat
    if (sunat?.last_error) return sunat.last_error
    if (recibo?.error_sunat?.trim()) return recibo.error_sunat.trim()
    return null
}
