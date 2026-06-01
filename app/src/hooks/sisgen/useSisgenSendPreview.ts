import { useMutation } from "@tanstack/react-query"
import {
    postSisgenSendPreview,
    type SisgenSendPreviewResponse,
} from "../../services/sisgen/sisgenSendPreviewService"
import type { SisgenSearchFilters } from "../../utils/buildSisgenSearchFilters"

export interface SisgenSendPreviewData {
    access: string
    filters: SisgenSearchFilters
}

const useSisgenSendPreview = () => {
    return useMutation<SisgenSendPreviewResponse, Error, SisgenSendPreviewData>({
        mutationFn: ({ filters, access }) => postSisgenSendPreview(filters, access),
    })
}

export default useSisgenSendPreview
