import { useMutation } from "@tanstack/react-query"
import {
    postSisgenSendDocuments,
    type SisgenSendDocumentsRequest,
    type SisgenSendDocumentsResponse,
} from "../../services/sisgen/processDocumentService"

export interface SisgenSendDocumentsData {
    access: string
    body: SisgenSendDocumentsRequest
}

const useSisgenSendDocuments = () => {
    return useMutation<SisgenSendDocumentsResponse, Error, SisgenSendDocumentsData>({
        mutationFn: ({ body, access }) => postSisgenSendDocuments(body, access),
    })
}

export default useSisgenSendDocuments
