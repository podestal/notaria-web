import { useQuery, UseQueryResult } from "@tanstack/react-query"
import ubigeoService, { Ubigeo } from "../../../services/api/ubigeoService"

const useGetUbigeos = (): UseQueryResult<Ubigeo[], Error> => {
    return useQuery({
        queryKey: ['ubigeos'],
        queryFn: () => ubigeoService.get(),
    })
}

export default useGetUbigeos