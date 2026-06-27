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
