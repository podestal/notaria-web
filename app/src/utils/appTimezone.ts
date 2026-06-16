import moment from "moment"
import "moment/locale/es"

/** IANA timezone for the notaría (Peru). */
export const APP_TIMEZONE = "America/Lima"

/** Default locale for dates, numbers, and copy. */
export const APP_LOCALE = "es-PE"

const dateInputFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
})

const timeHmFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: APP_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
})

/** Peru is fixed UTC-5 (no DST). */
export const APP_UTC_OFFSET = "-05:00"

/** Today as YYYY-MM-DD in Lima (for `<input type="date">`). */
export const getTodayDateInputValue = (date: Date = new Date()): string =>
    dateInputFormatter.format(date)

/** Current time as HH:mm in Lima. */
export const getCurrentTimeHHmm = (date: Date = new Date()): string =>
    timeHmFormatter.format(date)

/**
 * Build an ISO-8601 datetime in Lima for API payloads (fecha_emision, etc.).
 * Uses the form date (or today in Lima) + current wall-clock time in Lima.
 */
export const buildAppDateTimePayload = (dateInput?: string | null): string => {
    const date = dateInput?.trim() || getTodayDateInputValue()
    const time = getCurrentTimeHHmm()
    return `${date}T${time}:00${APP_UTC_OFFSET}`
}

export const formatAppDate = (
    value: string | Date | null | undefined,
    options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "short",
        year: "numeric",
    },
): string => {
    if (!value) return "—"

    const date = typeof value === "string" ? new Date(value) : value
    if (Number.isNaN(date.getTime())) {
        return typeof value === "string" ? value : "—"
    }

    return date.toLocaleDateString(APP_LOCALE, {
        ...options,
        timeZone: APP_TIMEZONE,
    })
}

export const formatAppDateTime = (
    value: string | Date | null | undefined,
): string => {
    if (!value) return "—"

    const date = typeof value === "string" ? new Date(value) : value
    if (Number.isNaN(date.getTime())) {
        return typeof value === "string" ? value : "—"
    }

    return date.toLocaleString(APP_LOCALE, {
        timeZone: APP_TIMEZONE,
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    })
}

/** Call once at app startup (locale + moment). */
export const initAppTimezone = (): void => {
    moment.locale("es")
}
