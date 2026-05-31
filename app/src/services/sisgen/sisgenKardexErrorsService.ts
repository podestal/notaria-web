import axios from "axios"
import SisgenClient from "./sisgenClient"

/** GET {VITE_SISGEN_URL}errors/kardex/:kardex/ → /sisgen/errors/kardex/K2-2026/ */
export interface SisgenKardexErrorsResponse {
    error: number
    kardex: string
    idkardex: string
    sisgen_error_count: number
    errores: string[]
    observaciones: string[]
    personas: string[]
    message?: string
}

/** Relative to VITE_SISGEN_URL (must not start with `/` or axios drops the `/sisgen/` base). */
const kardexErrorsEndpoint = (kardex: string) =>
    `errors/kardex/${encodeURIComponent(kardex)}/`

export const getSisgenKardexErrors = async (
    kardex: string,
    access: string,
): Promise<SisgenKardexErrorsResponse> => {
    const client = new SisgenClient<SisgenKardexErrorsResponse>(
        kardexErrorsEndpoint(kardex),
    )

    try {
        const data = await client.get(access)

        if (data.error !== 0) {
            throw new Error(
                data.message || "No se pudieron obtener los errores SISGEN del kardex.",
            )
        }

        return data
    } catch (err) {
        if (axios.isAxiosError(err)) {
            const apiMessage =
                (err.response?.data as { message?: string })?.message
                || (err.response?.data as { detail?: string })?.detail
            if (apiMessage) {
                throw new Error(apiMessage)
            }
        }
        throw err
    }
}
