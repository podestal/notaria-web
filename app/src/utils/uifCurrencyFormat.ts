import { MONEDAS } from "../data/patrimonialData"

const DOLARES_SYMBOL =
    MONEDAS.find((m) => m.codigo === "USD")?.simbolo?.trim() || "US$."
const SOLES_SYMBOL = "S/."

export const isDolaresMoneda = (tipoMoneda?: string): boolean => {
    const normalized = (tipoMoneda ?? "").trim().toUpperCase()
    return normalized.includes("DOLAR") || normalized === "USD"
}

const formatAmount = (value: number): string => {
    if (!Number.isFinite(value)) return "0"
    return Number.isInteger(value) ? String(value) : value.toFixed(2)
}

const normalizeSolesSymbol = (currencySymbol?: string): string => {
    const raw = (currencySymbol ?? SOLES_SYMBOL).trim()
    if (/S\/\.?/i.test(raw)) return "S/."
    return raw.endsWith(".") ? raw : `${raw}.`
}

const withSymbol = (symbol: string, amount: string): string => `${symbol} ${amount}`

/** Patrimonial: amount in the operation currency only (S/. or US$.). */
export const formatUifPatrimonial = (params: {
    patrimonial: number
    tipo_moneda?: string
    currency_symbol?: string
}): string => {
    const amount = formatAmount(params.patrimonial)

    if (isDolaresMoneda(params.tipo_moneda)) {
        const usdSymbol = DOLARES_SYMBOL.endsWith(".") ? DOLARES_SYMBOL : `${DOLARES_SYMBOL}.`
        return withSymbol(usdSymbol, amount)
    }

    return withSymbol(normalizeSolesSymbol(params.currency_symbol), amount)
}
