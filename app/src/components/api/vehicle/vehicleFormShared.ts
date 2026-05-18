import moment from "moment"

const FECINSC_DISPLAY_FORMAT = "DD/MM/YYYY"
const FECINSC_PARSE_FORMATS = ["DD/MM/YYYY", "YYYY-MM-DD", "DD-MM-YYYY"] as const

/** Keep only digits, max 3 (0–999). */
export function sanitizeThreeDigitIntInput(value: string): string {
    return value.replace(/\D/g, "").slice(0, 3)
}

/** Display value from API (number, string, decimals). */
export function parseThreeDigitIntForDisplay(raw: string | number | undefined | null): string {
    if (raw == null || raw === "") return ""
    const digits = String(raw).replace(/\D/g, "")
    if (!digits) return ""
    const n = parseInt(digits, 10)
    if (!Number.isFinite(n)) return ""
    return String(Math.min(n, 999))
}

/** API expects string; send normalized integer without leading zeros. */
export function formatThreeDigitIntForApi(value: string): string {
    const digits = value.replace(/\D/g, "")
    if (!digits) return ""
    const n = parseInt(digits, 10)
    if (!Number.isFinite(n)) return ""
    return String(Math.min(n, 999))
}

export function parseFecInscForDisplay(raw: string | undefined | null): string {
    const s = (raw ?? "").trim()
    if (!s) return ""
    const m = moment(s, [...FECINSC_PARSE_FORMATS], true)
    return m.isValid() ? m.format(FECINSC_DISPLAY_FORMAT) : s
}

export function isValidFecInsc(value: string): boolean {
    const s = value.trim()
    if (!s) return true
    return moment(s, FECINSC_DISPLAY_FORMAT, true).isValid()
}

/** Send fecha de inscripción as DD/MM/YYYY. */
export function formatFecInscForApi(value: string): string {
    const s = value.trim()
    if (!s) return ""
    const m = moment(s, FECINSC_DISPLAY_FORMAT, true)
    if (!m.isValid()) return s
    return m.format(FECINSC_DISPLAY_FORMAT)
}
