export const MIN_FOUR_DIGIT_YEAR = 1950

export const FOUR_DIGIT_YEAR_REGEX = /^$|^\d{4}$/

export const FOUR_DIGIT_YEAR_ERROR =
    "Ingrese un año de 4 dígitos desde 1950 (ej. 2008) o déjelo vacío."

export const isValidFourDigitYearOrEmpty = (value: string): boolean => {
    const trimmed = value.trim()
    if (trimmed === "") return true
    if (!/^\d{4}$/.test(trimmed)) return false
    return Number(trimmed) >= MIN_FOUR_DIGIT_YEAR
}

export const sanitizeFourDigitYearInput = (value: string): string =>
    value.replace(/\D/g, "").slice(0, 4)
