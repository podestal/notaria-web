import type { KardexError, KardexNoEnvian, KardexRO, KardexROValid } from "../api/kardexService"

export type UifReportPolicy = "all" | "cronologico" | "alfabetico"
export type UifErrorsType = "errors" | "ro" | "no_envian"
export type UifTabId = "errors" | "ro" | "not_ro"

export interface UifDateRangeSummary {
    start: string
    end: string
    start_iso?: string
    end_iso?: string
    start_formatted?: string
    end_formatted?: string
}

export interface UifRegistroSummary {
    total_kardex: number
    total_errors: number
    total_valid_ro?: number
    total_report_ro?: number
    total_report_with_errors?: number
    total_no_envian?: number
    total_ro_staged?: number
    total_ro_eligible?: number
    total_ro_below_threshold?: number
    total_ro_not_staged?: number
    error_breakdown: Record<string, number>
    date_range?: UifDateRangeSummary
}

export interface UifRegistroMetadata {
    processed_at: string
    include_valid_records?: boolean
    engine?: string
    phase?: number
    report_policy_default?: string
    current_filter?: string
    paginated_category?: string
    list_type?: string
}

export interface UifRegistroResults {
    lista_errores: KardexError[]
    lista_errores_agrupados?: Record<string, unknown[]>
    lista_kardex_ro: KardexROValid[]
    lista_kardex_no_envian: KardexNoEnvian[]
    summary: UifRegistroSummary
    metadata: UifRegistroMetadata
}

export interface UifErrorsApiPage {
    count: number
    next: string | null
    previous: string | null
    results: UifRegistroResults
}

export interface UifRegistroPage {
    count: number
    next: string | null
    previous: string | null
    results: KardexRO
}

export type UifRegistroBundle = KardexRO & {
    summary: UifRegistroSummary
    metadata: UifRegistroMetadata
}
