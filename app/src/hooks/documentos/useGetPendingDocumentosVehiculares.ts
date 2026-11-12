import { useMemo } from "react"
import type { UseQueryResult } from "@tanstack/react-query"
import {
    isDocumentoLinked,
    type DocumentoBien,
} from "../../services/documentos/documentosVehicularesService"
import useGetDocumentosVehiculares from "./useGetDocumentosVehiculares"

export const DOCUMENTOS_VEHICULARES_PENDING_KEY = [
    "documentos",
    "vehiculares",
    "pendientes",
] as const

/** Parsed + unlinked boletas from the shared vehiculares list query. */
const useGetPendingDocumentosVehiculares = (
    enabled = true,
): UseQueryResult<DocumentoBien[], Error> => {
    const query = useGetDocumentosVehiculares(enabled)

    const pending = useMemo(() => {
        const rows = query.data ?? []
        return rows.filter(
            (doc) =>
                doc.tipo === "vehicular" &&
                doc.status === "parsed" &&
                !isDocumentoLinked(doc),
        )
    }, [query.data])

    return {
        ...query,
        data: pending,
    } as UseQueryResult<DocumentoBien[], Error>
}

export default useGetPendingDocumentosVehiculares
