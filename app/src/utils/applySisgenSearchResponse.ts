import type { SisgenSearchHandlers } from "../hooks/sisgen/sisgenSearchKeys"
import type { SISGENSearchResponse } from "../services/sisgen/searchSisgenService"

export const applySisgenSearchResponse = (
    data: SISGENSearchResponse,
    handlers: SisgenSearchHandlers,
) => {
    if (data.error === 0) {
        console.log("[SISGEN search] docs from backend", data.data)
        handlers.setSisgenDocs(data.data)
        handlers.setItemsCount(data.pagination.total_documents)
        handlers.setSearchId(data.pagination.search_id)
        if (data.data.length === 0) {
            handlers.setNoDocsMessage("No se encontraron documentos SISGEN.")
        } else {
            handlers.setNoDocsMessage("")
        }
        handlers.setErrorDisplay("")
    } else {
        handlers.setErrorDisplay(
            data.message || "Error al buscar documentos SISGEN.",
        )
    }
}
