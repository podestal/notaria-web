/**
 * Serie notarial: solo dígitos, o dígitos + " VTA" al final (un espacio antes de VTA).
 * Ej.: `10100`, `10100 VTA`. No letras ni símbolos extra.
 */
export const SERIE_NOTARIAL_FORMAT_REGEX = /^\d+( VTA)?$/i

export function normalizeSerieNotarialWhitespace(raw: string): string {
    return raw.trim().replace(/\s+/g, " ")
}

/**
 * Solo dígitos al inicio; después del bloque numérico solo se permite un espacio y el prefijo de "VTA".
 * Elimina letras o símbolos antes del primer dígito y cualquier cosa inválida tras los dígitos.
 */
export function sanitizeSerieNotarialInput(raw: string): string {
    const fromFirstDigit = raw.replace(/^[^0-9]+/, "").replace(/\s+/g, " ")
    const digitMatch = fromFirstDigit.match(/^(\d+)/)
    if (!digitMatch) return ""

    const digits = digitMatch[1]
    const rest = fromFirstDigit.slice(digits.length)

    if (!rest.trim()) return digits

    const restNorm = rest.replace(/^\s+/, " ")
    if (!restNorm.startsWith(" ")) return digits

    const letterPart = restNorm.slice(1).replace(/[^vVtTaA]/gi, "")
    const want = "VTA"
    let acc = ""
    for (let i = 0; i < letterPart.length; i++) {
        const u = letterPart[i].toUpperCase()
        if (u === want[acc.length]) acc += want[acc.length]
        else break
    }

    if (acc.length === 0 && letterPart.length === 0) {
        return `${digits} `
    }

    return acc.length > 0 ? `${digits} ${acc}` : digits
}

export function isValidSerieNotarialFormat(raw: string): boolean {
    const t = normalizeSerieNotarialWhitespace(raw)
    if (!t) return false
    return SERIE_NOTARIAL_FORMAT_REGEX.test(t)
}

export type SerieNotarialParsed = { n: number; width: number; hasVta: boolean }

/** Parsea solo si cumple el formato permitido. */
export function parseSerieNotarialToken(raw: string): SerieNotarialParsed | null {
    const t = normalizeSerieNotarialWhitespace(raw)
    if (!t) return null
    const m = t.match(/^(\d+)( VTA)?$/i)
    if (!m) return null
    const digits = m[1]
    const hasVta = Boolean(m[2])
    const n = parseInt(digits, 10)
    if (Number.isNaN(n)) return null
    return { n, width: digits.length, hasVta }
}

export function compareSerieNotarial(a: string, b: string): number | null {
    const pa = parseSerieNotarialToken(a)
    const pb = parseSerieNotarialToken(b)
    if (!pa || !pb) return null
    if (pa.n !== pb.n) return pa.n - pb.n
    if (pa.hasVta === pb.hasVta) return 0
    return pa.hasVta ? 1 : -1
}

export const SERIE_NOTARIAL_VTA_SUFFIX = " VTA"
