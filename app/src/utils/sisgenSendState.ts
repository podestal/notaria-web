import type { SISGENDocument } from "../services/sisgen/searchSisgenService"

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
