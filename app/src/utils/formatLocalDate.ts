import { APP_LOCALE, APP_TIMEZONE } from "./appTimezone"

const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

export const parseLocalDateParts = (
    value: string,
): { year: number; month: number; day: number } | null => {
    const match = value.trim().match(DATE_ONLY_PATTERN)
    if (!match) return null

    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])
    if (month < 1 || month > 12 || day < 1 || day > 31) return null

    return { year, month, day }
}

/** Format YYYY-MM-DD without UTC timezone shift; datetimes use America/Lima. */
export const formatLocalDate = (
    value: string | null | undefined,
    locale = APP_LOCALE,
): string => {
    if (!value) return "—"

    const parts = parseLocalDateParts(value)
    if (parts) {
        const date = new Date(parts.year, parts.month - 1, parts.day)
        return date.toLocaleDateString(locale, {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: APP_TIMEZONE,
    })
}

/** Normalize API/date values to `<input type="date">` format (YYYY-MM-DD). */
export const toDateInputValue = (value: string | null | undefined): string => {
    if (!value) return ""

    const parts = parseLocalDateParts(value)
    if (parts) {
        const { year, month, day } = parts
        return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    }

    const slashMatch = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (slashMatch) {
        return `${slashMatch[3]}-${slashMatch[2]}-${slashMatch[1]}`
    }

    const dashMatch = value.trim().match(/^(\d{2})-(\d{2})-(\d{4})$/)
    if (dashMatch) {
        return `${dashMatch[3]}-${dashMatch[2]}-${dashMatch[1]}`
    }

    return value.slice(0, 10)
}

/** Parse API/display dates (DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD) as local calendar date. */
export const parseDisplayDate = (value: string | null | undefined): Date | undefined => {
    if (!value?.trim()) return undefined

    const normalized = toDateInputValue(value)
    const parts = parseLocalDateParts(normalized)
    if (parts) {
        return new Date(parts.year, parts.month - 1, parts.day)
    }

    return undefined
}

/** Format date for kardex API payloads (DD/MM/YYYY). */
export const formatKardexFechaIngreso = (date: Date | undefined | null): string => {
    if (!date || Number.isNaN(date.getTime())) return ""

    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
}
