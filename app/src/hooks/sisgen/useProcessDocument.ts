import { useMutation, UseMutationResult } from "@tanstack/react-query"
import {
    postSisgenSendDocuments,
    type SisgenRequest,
    type SisgenSendDocumentsResponse,
} from "../../services/sisgen/processDocumentService"

interface SisgenRequestData {
    access: string
    data: SisgenRequest
}

const useProcessDocument = (): UseMutationResult<
    SisgenSendDocumentsResponse,
    Error,
    SisgenRequestData
> => {
    return useMutation({
        mutationFn: (data: SisgenRequestData) =>
            postSisgenSendDocuments(
                { documents: data.data.documents },
                data.access,
            ),
    })
}

export default useProcessDocument
