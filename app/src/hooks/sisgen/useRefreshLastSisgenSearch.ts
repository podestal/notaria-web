import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import searchSisgenService from "../../services/sisgen/searchSisgenService"
import { applySisgenSearchResponse } from "../../utils/applySisgenSearchResponse"
import type { SearchSisgenData } from "./useSearchSisgen"
import {
    getSisgenSearchHandlers,
    sisgenSearchKeys,
} from "./sisgenSearchKeys"

const useRefreshLastSisgenSearch = () => {
    const queryClient = useQueryClient()

    return useCallback(async () => {
        const variables = queryClient.getQueryData<SearchSisgenData>(
            sisgenSearchKeys.lastRequest(),
        )
        const handlers = getSisgenSearchHandlers()

        if (!variables || !handlers) return

        await queryClient.invalidateQueries({ queryKey: sisgenSearchKeys.all })

        // Do not set loading — SisgenBody hides the table while loading, which unmounts the kardex modal.
        try {
            const data = await searchSisgenService.post(
                variables.sisgen,
                variables.access,
            )
            applySisgenSearchResponse(data, handlers)
        } catch (error) {
            handlers.setErrorDisplay(
                error instanceof Error
                    ? error.message
                    : "Error al buscar documentos SISGEN.",
            )
        }
    }, [queryClient])
}

export default useRefreshLastSisgenSearch
