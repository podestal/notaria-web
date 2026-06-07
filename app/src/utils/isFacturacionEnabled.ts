export const isFacturacionEnabled = (): boolean => {
    const raw = import.meta.env.VITE_TAX_IGV
    if (raw === undefined || raw === null) return false

    const trimmed = String(raw).trim()
    if (!trimmed) return false

    const parsed = parseFloat(trimmed)
    return !Number.isNaN(parsed) && parsed > 0
}
