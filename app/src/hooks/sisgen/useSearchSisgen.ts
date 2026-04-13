import { useMutation, UseMutationResult } from "@tanstack/react-query"
import searchSisgenService, {SISGENSearchRequest, SISGENSearchResponse} from "../../services/sisgen/searchSisgenService"

export interface SearchSisgenData {
    access: string
    sisgen: SISGENSearchRequest
}

export const useSearchSisgen = (): UseMutationResult<SISGENSearchResponse, Error, SearchSisgenData> => {
    return useMutation({
        mutationFn: async (data: SearchSisgenData) => searchSisgenService.post(data.sisgen, data.access),
        onSuccess: (data) => {
            console.log("Búsqueda de SISGEN exitosa:", data)
        },
        onError: (error) => {
            console.error("Error en la búsqueda de SISGEN:", error)
        }
    })
}

export default useSearchSisgen