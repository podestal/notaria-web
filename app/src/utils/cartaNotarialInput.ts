/** `Documento Nacional de Identidad` in ALL_DOCUMENTS_OPTIONS */
export const DNI_DOCUMENT_TYPE = 1

const PHONE_ALLOWED_PATTERN = /^[0-9+\-().\s]*$/

export const sanitizeDniInput = (value: string): string =>
    value.replace(/\D/g, "").slice(0, 8)

export const sanitizePhoneInput = (value: string): string =>
    value.replace(/[^0-9+\-().\s]/g, "")

export const validateDniDocument = (value: string): string | null => {
    if (!/^\d{8}$/.test(value)) {
        return "El DNI debe tener 8 dígitos numéricos."
    }
    return null
}

export const validatePhone = (value: string): string | null => {
    const trimmed = value.trim()
    if (!trimmed) return null
    if (!PHONE_ALLOWED_PATTERN.test(trimmed)) {
        return "Teléfono inválido. Use números y caracteres como + ( ) - ."
    }
    return null
}
