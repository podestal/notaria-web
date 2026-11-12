import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import {
    submitDocumentoVehicular,
    type DocumentoBien,
} from "../../services/documentos/documentosVehicularesService"
import useAuthStore from "../store/useAuthStore"
import { DOCUMENTOS_VEHICULARES_LIST_KEY } from "./useGetDocumentosVehiculares"

export { DOCUMENTOS_VEHICULARES_PENDING_KEY } from "./useGetPendingDocumentosVehiculares"

const useSubmitDocumentoVehicular = (): UseMutationResult<
    DocumentoBien,
    Error,
    File
> => {
    const access = useAuthStore((s) => s.access_token) || ""
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (file: File) => submitDocumentoVehicular(file, access),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: DOCUMENTOS_VEHICULARES_LIST_KEY,
            })
        },
    })
}

export default useSubmitDocumentoVehicular
