import SisgenClient from "./sisgenClient"
import type { SisgenSendDocumentItem } from "./processDocumentService"
import type { SisgenSearchFilters } from "../../utils/buildSisgenSearchFilters"
import type { SisgenSubmissionError } from "../../utils/sisgenSubmissionErrors"

export type SisgenSendJobStatus = "pending" | "running" | "completed" | "failed"
export type SisgenSendDocStatus = "pending" | "running" | "completed" | "failed" | "skipped"
export type SisgenSendAttempt = "batch" | "single"

export interface SisgenSendJobDocument {
    kardex: string
    idkardex?: string
    status: SisgenSendDocStatus
    batch_index?: number
    attempt?: SisgenSendAttempt | null
    message?: string | null
    submission_response_id?: number | null
}

export interface SisgenSendBatchSummary {
    expected_batches: number
    completed: number
    soap_rejected: number
    fan_out: number
}

/** Sync send result shape returned in `result` when job status is `completed`. */
export interface SisgenSendResult {
    error: number
    messageDescription?: string
    message?: string
    guardados?: number
    fallidos?: number
    observados?: number
    processed_kardex?: string[]
    batch_summary?: SisgenSendBatchSummary
    batches?: unknown[]
    errores_sisgen_usuario?: SisgenSubmissionError[]
    sisgen_last_submission_by_kardex?: Record<string, unknown>
}

export interface SisgenSendJobResponse {
    error: number
    job_id: number
    status: SisgenSendJobStatus
    message?: string
    celery_task_id?: string
    progress_processed?: number
    progress_total?: number
    progress?: string
    payload?: {
        documents: SisgenSendDocumentItem[]
        filters: Partial<SisgenSearchFilters>
    }
    result: SisgenSendResult | null
    /** Worker/orchestrator failure when status is `failed`. */
    failure_message?: string
    created_at?: string
    updated_at?: string
    finished_at?: string | null
    status_url?: string
    documents: SisgenSendJobDocument[]
}

const parseSendJobResponse = (data: unknown): SisgenSendJobResponse => {
    const raw = data as Record<string, unknown>
    const failureMessage =
        typeof raw.error === "string"
            ? raw.error
            : typeof raw.failure_message === "string"
              ? raw.failure_message
              : undefined

    return {
        ...(raw as SisgenSendJobResponse),
        error: typeof raw.error === "number" ? raw.error : 0,
        failure_message: failureMessage,
        documents: Array.isArray(raw.documents) ? raw.documents as SisgenSendJobDocument[] : [],
        result: (raw.result as SisgenSendResult | null) ?? null,
    }
}

const getSendJobClient = (jobId: number) =>
    new SisgenClient<SisgenSendJobResponse>(`send-jobs/${jobId}/`)

export const getSisgenSendJob = async (
    jobId: number,
    access: string,
): Promise<SisgenSendJobResponse> => {
    const client = getSendJobClient(jobId)
    const data = await client.get(access)
    return parseSendJobResponse(data)
}
