import type {
    SisgenSendDocStatus,
    SisgenSendJobDocument,
} from "../services/sisgen/sisgenSendJobService"

export interface SisgenJobDocumentSummary {
    total: number
    completados: number
    fallidos: number
    omitidos: number
    pendientes: number
    enProceso: number
}

const STATUS_PRIORITY: Record<SisgenSendDocStatus, number> = {
    failed: 5,
    completed: 4,
    running: 3,
    skipped: 2,
    pending: 1,
}

/** One row per kardex; if the API emits duplicates (batch fan-out), keep the worst status. */
export const summarizeSisgenJobDocuments = (
    documents: SisgenSendJobDocument[],
): SisgenJobDocumentSummary => {
    const byKardex = new Map<string, SisgenSendDocStatus>()

    for (const doc of documents) {
        const current = byKardex.get(doc.kardex)
        if (
            !current
            || STATUS_PRIORITY[doc.status] > STATUS_PRIORITY[current]
        ) {
            byKardex.set(doc.kardex, doc.status)
        }
    }

    const summary: SisgenJobDocumentSummary = {
        total: byKardex.size,
        completados: 0,
        fallidos: 0,
        omitidos: 0,
        pendientes: 0,
        enProceso: 0,
    }

    for (const status of byKardex.values()) {
        switch (status) {
            case "completed":
                summary.completados += 1
                break
            case "failed":
                summary.fallidos += 1
                break
            case "skipped":
                summary.omitidos += 1
                break
            case "running":
                summary.enProceso += 1
                break
            default:
                summary.pendientes += 1
        }
    }

    return summary
}

export const hasSisgenJobDocumentSummary = (
    summary: SisgenJobDocumentSummary,
): boolean => summary.total > 0
