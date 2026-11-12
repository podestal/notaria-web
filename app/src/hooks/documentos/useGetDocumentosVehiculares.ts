import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import {
    listDocumentosVehiculares,
    type DocumentoBien,
} from "../../services/documentos/documentosVehicularesService"
import { getStoredAccessToken } from "../../services/http/attachAxiosAuthRequestInterceptor"
import useAuthStore from "../store/useAuthStore"

export const DOCUMENTOS_VEHICULARES_LIST_KEY = ["documentos", "vehiculares", "list"] as const

const useGetDocumentosVehiculares = (
    enabled = true,
): UseQueryResult<DocumentoBien[], Error> => {
    const access = useAuthStore((s) => s.access_token) || ""
    const token = (access || getStoredAccessToken() || "").trim()

    return useQuery({
        queryKey: DOCUMENTOS_VEHICULARES_LIST_KEY,
        queryFn: async () => {
            const auth = (getStoredAccessToken() || access || "").trim()
            if (!auth) throw new Error("No autenticado")
            const rows = await listDocumentosVehiculares(auth)
            return Array.isArray(rows) ? rows : []
        },
        enabled: enabled && Boolean(token),
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        retry: 1,
    })
}

export default useGetDocumentosVehiculares
