/** True when a required text/select value is empty or still on placeholder "0". */
export const isRequiredValueMissing = (value?: string | null): boolean => {
    const normalized = String(value ?? '').trim()
    return normalized === '' || normalized === '0'
}

export const isRequiredTextMissing = (value?: string | null): boolean =>
    String(value ?? '').trim() === ''

/**
 * Removes disallowed characters, keeping letters (incl. accents/ñ), spaces and the
 * connectors apostrophe (') and hyphen (-) used in compound surnames.
 */
export const sanitizeNameInput = (value: string): string =>
    value.replace(/[^A-Za-zÀ-ÿ\s'-]/g, '')

/** True when the value contains no letters (e.g. only spaces or connectors like "-"). */
export const hasNoLetters = (value?: string | null): boolean =>
    !/[A-Za-zÀ-ÿ]/.test(String(value ?? ''))

/** Persona jurídica (tipo 2): residente vacío; natural: 1/0 según selector. */
export const residenteForClientePayload = (
    selectedTipoPersona: number,
    resident: number
): string => (selectedTipoPersona === 2 ? '' : resident === 1 ? '1' : '0')

/** PATCH jurídica: no enviar residente/resedent (evita sobrescribir con 0). */
export const omitResidenteFieldsForJuridicaPatch = <T extends Record<string, unknown>>(
    payload: Partial<T>,
    selectedTipoPersona: number
): Partial<T> => {
    if (selectedTipoPersona !== 2) return payload
    const { residente: _r, resedent: _e, ...rest } = payload
    return rest
}
