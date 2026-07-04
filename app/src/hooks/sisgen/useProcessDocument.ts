import { useMutation, UseMutationResult } from "@tanstack/react-query"
import {
    postSisgenSendDocuments,
    type SisgenRequest,
} from "../../services/sisgen/processDocumentService"
import type { SisgenSendJobResponse } from "../../services/sisgen/sisgenSendJobService"
import { pollSisgenSendJob } from "../../utils/pollSisgenSendJob"

interface SisgenRequestData {
    access: string
    data: SisgenRequest
}

const useProcessDocument = (): UseMutationResult<
    SisgenSendJobResponse,
    Error,
    SisgenRequestData
> => {
    return useMutation({
        mutationFn: async (data: SisgenRequestData) => {
            const enqueue = await postSisgenSendDocuments(
                { documents: data.data.documents },
                data.access,
            )

            if (enqueue.error !== 0) {
                throw new Error(
                    enqueue.message || "Error al encolar el envío a SISGEN.",
                )
            }

            return pollSisgenSendJob(enqueue.job_id, data.access)
        },
    })
}

export default useProcessDocument
