import useGetComplianceMeKardex from "../../../hooks/compliance/useGetComplianceMeKardex"
import useAuthStore from "../../../store/useAuthStore"
import {
    getComplianceMeTone,
    getCompliancePastMonthsWithErrors,
} from "../../../services/compliance/complianceService"

const SHORT_MONTHS = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
]

export const useCompliancePastMonthsUrgent = () => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { data } = useGetComplianceMeKardex({
        access,
        enabled: Boolean(access),
    })

    if (!data || getComplianceMeTone(data) !== "red") {
        return { show: false as const, monthsLabel: "", errorTotal: 0 }
    }

    const pastMonths = getCompliancePastMonthsWithErrors(data)
    if (pastMonths.length === 0) {
        return { show: false as const, monthsLabel: "", errorTotal: 0 }
    }

    return {
        show: true as const,
        monthsLabel: pastMonths
            .map((m) => `${SHORT_MONTHS[m.month - 1] ?? m.month} ${m.year}`)
            .join(", "),
        errorTotal: pastMonths.reduce((sum, m) => sum + (m.counts?.total ?? 0), 0),
    }
}
