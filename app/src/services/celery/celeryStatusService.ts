import CeleryClient from "./celeryCliente"

export interface CeleryBeatTask {
    name: string
    task: string
    type: string
    every_seconds?: number
    schedule?: string
    last_run_at?: string | null
    next_run_at?: string | null
    run_count?: number
}

export interface CelerySunatItem {
    id?: number
    recibo_id?: number
    status?: string
    retry_count?: number
    last_error?: string | null
    next_retry_at?: string | null
    created_at?: string | null
    updated_at?: string | null
}

export interface CeleryStatusResponse {
    beat_tasks: CeleryBeatTask[]
    sunat_retries: CelerySunatItem[]
    sunat_failed: CelerySunatItem[]
}

export const celeryStatusService = new CeleryClient<CeleryStatusResponse>("/")
