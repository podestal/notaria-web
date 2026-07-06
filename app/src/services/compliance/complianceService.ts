import complianceAxios from "./complianceClient"

export interface ComplianceErrorCounts {
    sisgen: number
    uif: number
    pdt: number
    total: number
}

export interface CompliancePeriod {
    start: string
    end: string
    date_field: string
}

export interface ComplianceSummary {
    total_kardex: number
    total_users: number
    kardex_with_errors: number
    counts: ComplianceErrorCounts
    pdt_note?: string
}

export interface ComplianceUser {
    idusuario: number
    name: string
    username: string
    total_kardex: number
    kardex_with_errors: number
    kardex_clean: number
    error_rate: number
    counts: ComplianceErrorCounts
}

export interface ComplianceUsersResponse {
    year: number
    month: number
    period: CompliancePeriod
    summary: ComplianceSummary
    users: ComplianceUser[]
}

export interface ComplianceUserRef {
    idusuario: number
    name: string
    username: string
}

export interface ComplianceUserKardexItem {
    idkardex: number
    kardex: string
    contrato?: string
    fechaingreso?: string
    counts: ComplianceErrorCounts
}

export interface ComplianceUserKardexResponse {
    user: ComplianceUserRef
    kardex_count: number
    counts: ComplianceErrorCounts
    kardex: ComplianceUserKardexItem[]
}

export interface ComplianceMeKardexResponse extends ComplianceUserKardexResponse {
    year: number
    month: number
    total_kardex: number
    kardex_with_errors: number
    error_rate: number
}

export const getCurrentCompliancePeriod = () => {
    const now = new Date()
    return {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
    }
}

export interface ComplianceSisgenErrors {
    errores: string[]
    personas: string[]
    observaciones: string[]
}

export interface ComplianceUifErrorItem {
    error_type: string
    error_description: string
}

export interface ComplianceUifErrors {
    errors: ComplianceUifErrorItem[]
    observations: ComplianceUifErrorItem[]
}

export interface CompliancePdtErrors {
    status: string
    errors: string[]
    note?: string
}

export interface ComplianceKardexErrorsDetail {
    sisgen: ComplianceSisgenErrors
    uif: ComplianceUifErrors
    pdt: CompliancePdtErrors
}

export interface ComplianceKardexErrorsResponse {
    kardex: string
    idkardex: string
    numescritura: string
    fechaingreso: string
    fechaescritura: string
    validated_at: string
    source: string
    has_errors: boolean
    counts: ComplianceErrorCounts
    errors: ComplianceKardexErrorsDetail
    kardex_meta?: Record<string, unknown>
}

const authHeaders = (access: string) => ({
    Authorization: `JWT ${access}`,
})

export const getComplianceUsers = (
    access: string,
    month?: number,
): Promise<ComplianceUsersResponse> => {
    const params: Record<string, string> = {}
    if (month != null) {
        params.month = String(month)
    }

    return complianceAxios
        .get<ComplianceUsersResponse>("users/", {
            headers: authHeaders(access),
            params,
        })
        .then((res) => res.data)
}

export const getComplianceUserKardex = (
    access: string,
    userId: number,
    year: number,
    month: number,
): Promise<ComplianceUserKardexResponse> =>
    complianceAxios
        .get<ComplianceUserKardexResponse>(`users/${userId}/kardex/`, {
            headers: authHeaders(access),
            params: {
                year: String(year),
                month: String(month),
            },
        })
        .then((res) => res.data)

export const getComplianceMeKardex = (
    access: string,
    year?: number,
    month?: number,
): Promise<ComplianceMeKardexResponse> => {
    const period = getCurrentCompliancePeriod()
    return complianceAxios
        .get<ComplianceMeKardexResponse>("me/kardex/", {
            headers: authHeaders(access),
            params: {
                year: String(year ?? period.year),
                month: String(month ?? period.month),
            },
        })
        .then((res) => res.data)
}

export const getComplianceKardexErrors = (
    access: string,
    kardex: string,
): Promise<ComplianceKardexErrorsResponse> =>
    complianceAxios
        .get<ComplianceKardexErrorsResponse>(
            `kardex/${encodeURIComponent(kardex)}/errors/`,
            { headers: authHeaders(access) },
        )
        .then((res) => res.data)
