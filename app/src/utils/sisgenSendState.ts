import type { SISGENDocument } from "../services/sisgen/searchSisgenService"

const normalizeSisgenCount = (value: unknown): number => {
    if (value === null || value === undefined || value === "") return 0
    const n = typeof value === "number" ? value : Number(value)
    if (Number.isNaN(n)) return 0
    return Math.max(0, Math.floor(n))
}

export interface SisgenValidationCounts {
    errores: number
    observaciones: number
    personas: number
}

export const getSisgenValidationCounts = (
    doc: SISGENDocument,
): SisgenValidationCounts => ({
    errores: normalizeSisgenCount(doc.sisgen_error_count),
    observaciones: normalizeSisgenCount(doc.sisgen_observaciones_count),
    personas: normalizeSisgenCount(doc.sisgen_personas_count),
})

export const getSisgenValidationTotal = (counts: SisgenValidationCounts): number =>
    counts.errores + counts.observaciones + counts.personas

/** @deprecated Use getSisgenValidationCounts for search rows */
export const getSisgenErrorCount = (doc: SISGENDocument): number =>
    getSisgenValidationCounts(doc).errores

export const formatSisgenErrorCountLabel = (count: number): string => {
    if (count === 0) return "Sin errores"
    if (count === 1) return "1 error"
    return `${count} errores`
}

/** Label shown in the Estado column */
export const getSisgenDisplayStatus = (doc: SISGENDocument): string =>
    doc.sisgen_status?.estado_sisgen_label
    || doc.estado_sisgen
    || doc.estadoSisgen
    || doc.sisgen_last_submission?.document_status
    || ""

/**
 * Whether the user may send / resend to SISGEN.
 * Backend sets `can_send` and `needs_resubmit` when last submission is stale (e.g. datos modificados).
 */
export const canSendSisgenDocument = (doc: SISGENDocument): boolean => {
    if (doc.sisgen_last_submission?.can_send === true) return true
    if (doc.sisgen_status?.can_send === true) return true

    if (doc.sisgen_status?.needs_resubmit === true) return true
    if (doc.sisgen_last_submission?.needs_resubmit === true) return true

    const statusUi =
        doc.sisgen_last_submission?.status_ui
        || doc.sisgen_status?.status_ui
    if (statusUi === "pendiente_reenvio") return true

    if (doc.sisgen_last_submission?.can_send === false) return false
    if (doc.sisgen_status?.can_send === false) return false

    const remote = (
        doc.sisgen_last_submission?.remote_status_ui
        || doc.sisgen_last_submission?.document_status
        || ""
    ).trim().toLowerCase()

    if (doc.sisgen_last_submission?.exists && remote === "guardado") {
        return false
    }

    if ((doc.estado_sisgen || "").trim().toLowerCase() === "enviado") return false
    if ((doc.estadoSisgen || "").trim().toLowerCase() === "enviado") return false

    return true
}
