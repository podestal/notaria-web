import SisgenClient from "./sisgenClient"
import type { SisgenSearchFilters } from "../../utils/buildSisgenSearchFilters"
import type {
    SisgenSendJobDocument,
    SisgenSendJobResponse,
    SisgenSendJobStatus,
    SisgenSendResult,
} from "./sisgenSendJobService"

export interface SisgenSendDocumentItem {
    kardex: string
    idkardex: string
}

export type SisgenSendDocumentsRequest = SisgenSearchFilters & {
    documents: SisgenSendDocumentItem[]
}

/** @deprecated Use SisgenSendResult from sisgenSendJobService for completed job results. */
export type SisgenSendDocumentsResponse = SisgenSendResult

export interface SisgenSendEnqueueResponse {
    error: number
    message?: string
    job_id: number
    status: SisgenSendJobStatus
    celery_task_id?: string
    progress_processed?: number
    progress_total?: number
    progress?: string
    payload?: SisgenSendJobResponse["payload"]
    result: SisgenSendResult | null
    failure_message?: string
    created_at?: string
    updated_at?: string
    finished_at?: string | null
    status_url?: string
    documents: SisgenSendJobDocument[]
}

/** @deprecated Legacy single/batch payload; prefer SisgenSendDocumentsRequest without `all`. */
export interface SisgenRequest {
    all?: number
    documents: SisgenSendDocumentItem[]
}

export interface SisgenDoc {
    idkardex: string
    kardex: string
    numescritura: string
    fechaescritura: string
    estado_sisgen: string
    idtipkar: number
    fechaingreso: string
    codactos: string
    contrato: string
    folioini: string
    foliofin: string
    fechaconclusion: string
    cod_ancert: string
    actouif: string
    actosunat: string
    notary_data: {
        codnotario: string
        codoficial: string
        coduif: string
        nombre_notario: string
        direccion: string
        distrito: string
        provincia: string
        departamento: string
    }
}

/** @deprecated Legacy response shape */
export interface SisgenResponse {
    error: number
    data: SisgenDoc[]
    total: number
}

const parseEnqueueResponse = (data: unknown): SisgenSendEnqueueResponse => {
    const raw = data as Record<string, unknown>
    const failureMessage =
        typeof raw.error === "string"
            ? raw.error
            : typeof raw.failure_message === "string"
              ? raw.failure_message
              : undefined

    return {
        ...(raw as SisgenSendEnqueueResponse),
        error: typeof raw.error === "number" ? raw.error : 0,
        failure_message: failureMessage,
        documents: Array.isArray(raw.documents) ? raw.documents as SisgenSendJobDocument[] : [],
        result: (raw.result as SisgenSendResult | null) ?? null,
    }
}

const sendClient = new SisgenClient<SisgenSendEnqueueResponse, SisgenSendDocumentsRequest>(
    "send-sisgen/",
)

export const postSisgenSendDocuments = async (
    body: SisgenSendDocumentsRequest,
    access: string,
): Promise<SisgenSendEnqueueResponse> => {
    const data = await sendClient.post(body, access)
    return parseEnqueueResponse(data)
}

export default sendClient
