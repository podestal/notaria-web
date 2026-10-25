import APIClient from "./apiClient"

export type KardexLogAction = "create" | "update" | "delete" | string

export type KardexLogChangeValue =
    | string
    | number
    | boolean
    | null
    | KardexLogChangeValue[]
    | { [key: string]: KardexLogChangeValue }

export interface KardexLogChange {
    old: KardexLogChangeValue
    new: KardexLogChangeValue
}

export interface KardexLog {
    id: number
    kardex: string
    idkardex: number
    table_name: string
    record_pk: string
    record_label?: string
    action: KardexLogAction
    changes: Record<string, KardexLogChange>
    user_id: number
    username: string
    source: string
    created_at: string
}

export interface KardexLogPage {
    count: number
    next: string | null
    previous: string | null
    results: KardexLog[]
}

export const KARDEX_LOGS_QUERY_KEY = "kardex-logs"

export const getKardexLogs = (
    access: string,
    idkardex: number,
    page = 1,
): Promise<KardexLogPage> => {
    const client = new APIClient<KardexLogPage>(`/kardex/${idkardex}/logs/`)
    return client.get(access, { page: String(page) })
}
