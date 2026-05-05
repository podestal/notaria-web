/** Construye DD/MM/AAAA a partir de hasta 8 dígitos (entrada tipo Participa). */
export function digitsToDdMmYyyy(digitsRaw: string): string {
    const d = digitsRaw.replace(/\D/g, "").slice(0, 8)
    if (d.length <= 2) return d
    if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`
    return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`
}

/** Valor API o legado → pantalla DD/MM/YYYY. */
export function fechafirmaToDisplay(raw: string | undefined): string {
    if (!raw?.trim()) return ""
    const t = raw.trim()
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(t)) return t
    const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(t)
    if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`
    return digitsToDdMmYyyy(t)
}

export function isValidCompleteDdMmYyyy(s: string): boolean {
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s)
    if (!m) return false
    const day = Number(m[1])
    const month = Number(m[2])
    const year = Number(m[3])
    if (month < 1 || month > 12) return false
    if (day < 1 || day > 31) return false
    const dt = new Date(year, month - 1, day)
    return dt.getFullYear() === year && dt.getMonth() === month - 1 && dt.getDate() === day
}
