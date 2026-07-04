import { useMutation } from "@tanstack/react-query"
import {
    postSisgenSendDocuments,
    type SisgenSendDocumentsRequest,
    type SisgenSendEnqueueResponse,
} from "../../services/sisgen/processDocumentService"

export interface SisgenSendDocumentsData {
    access: string
    body: SisgenSendDocumentsRequest
}

const useSisgenSendDocuments = () => {
    return useMutation<SisgenSendEnqueueResponse, Error, SisgenSendDocumentsData>({
        mutationFn: ({ body, access }) => postSisgenSendDocuments(body, access),
    })
}

export default useSisgenSendDocuments
