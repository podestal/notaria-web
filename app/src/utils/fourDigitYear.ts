export const FOUR_DIGIT_YEAR_REGEX = /^$|^\d{4}$/

export const FOUR_DIGIT_YEAR_ERROR =
    "Ingrese un año de 4 dígitos (ej. 2008) o déjelo vacío."

export const isValidFourDigitYearOrEmpty = (value: string): boolean =>
    FOUR_DIGIT_YEAR_REGEX.test(value.trim())

export const sanitizeFourDigitYearInput = (value: string): string =>
    value.replace(/\D/g, "").slice(0, 4)
