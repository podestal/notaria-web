import SisgenClient from "./sisgenClient"
import type { SisgenSearchFilters } from "../../utils/buildSisgenSearchFilters"
import type { SisgenInstrumentoStats } from "./searchSisgenService"

export type { SisgenInstrumentoStats } from "./searchSisgenService"

export interface SisgenSendPreviewDocument {
    kardex: string
    idkardex: string
    contrato: string
    numero_instrumento?: string
}

export interface SisgenSendPreviewResponse {
    error: number
    total: number
    filters: SisgenSearchFilters
    documents: SisgenSendPreviewDocument[]
    instrumento_stats?: SisgenInstrumentoStats
    message?: string
}

const previewClient = new SisgenClient<
    SisgenSendPreviewResponse,
    SisgenSearchFilters
>("send-sisgen/preview/")

export const postSisgenSendPreview = (
    filters: SisgenSearchFilters,
    access: string,
) => previewClient.post(filters, access)

export default previewClient
