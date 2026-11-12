import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import {
    applyDocumentoVehicular,
    type ApplyDocumentoVehicularPayload,
    type ApplyDocumentoVehicularResponse,
} from "../../services/documentos/documentosVehicularesService"
import useAuthStore from "../store/useAuthStore"
import { DOCUMENTOS_VEHICULARES_LIST_KEY } from "./useGetDocumentosVehiculares"

const useApplyDocumentoVehicular = (): UseMutationResult<
    ApplyDocumentoVehicularResponse,
    Error,
    ApplyDocumentoVehicularPayload
> => {
    const access = useAuthStore((s) => s.access_token) || ""
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload) => applyDocumentoVehicular(payload, access),
        onSuccess: (_data, variables) => {
            void queryClient.invalidateQueries({
                queryKey: DOCUMENTOS_VEHICULARES_LIST_KEY,
            })
            void queryClient.invalidateQueries({
                queryKey: ["vehiculares by kardex", variables.kardex],
            })
        },
    })
}

export default useApplyDocumentoVehicular
