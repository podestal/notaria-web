import SisgenClient from "./sisgenClient"
import type { SisgenSearchFilters } from "../../utils/buildSisgenSearchFilters"

export interface SisgenSendPreviewDocument {
    kardex: string
    idkardex: string
    contrato: string
}

export interface SisgenSendPreviewResponse {
    error: number
    total: number
    filters: SisgenSearchFilters
    documents: SisgenSendPreviewDocument[]
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
