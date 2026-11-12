import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import { deleteDocumentoBien } from "../../services/documentos/documentosVehicularesService"
import useAuthStore from "../store/useAuthStore"
import { DOCUMENTOS_VEHICULARES_LIST_KEY } from "./useGetDocumentosVehiculares"

const useDeleteDocumentoBien = (): UseMutationResult<void, Error, number> => {
    const access = useAuthStore((s) => s.access_token) || ""
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: number) => deleteDocumentoBien(id, access),
        onSuccess: () => {
            void queryClient.invalidateQueries({
                queryKey: DOCUMENTOS_VEHICULARES_LIST_KEY,
            })
        },
    })
}

export default useDeleteDocumentoBien
