/** Kardex-level SISGEN validation detail (future GET endpoint). */
export interface SisgenKardexErrorsResponse {
    error: number
    kardex: string
    idkardex: string
    sisgen_error_count: number
    errores: string[]
    observaciones: string[]
    personas: string[]
}

/** Temporary mock until the API is wired. */
export const simulateSisgenKardexErrors = (
    idkardex: number,
    kardex: string,
): SisgenKardexErrorsResponse => ({
    error: 0,
    kardex,
    idkardex: String(idkardex),
    sisgen_error_count: 2,
    errores: [
        "detallemediopago: moneda informada sin importe válido",
    ],
    observaciones: [
        "Falta código ANCERT",
    ],
    personas: [
        "EMPRESA SA (RUC: 20610484949): Falta información registral",
    ],
})

// TODO: replace simulate with GET when backend is ready, e.g. `/kardex-errors/?idkardex=`
