import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getTipokardexService, { Tipokardex } from "../../../services/api/tipokardexService"

const useGetTipoKardexList = (): UseQueryResult<Tipokardex[], Error> => {
    const tipoKardexService = getTipokardexService()
    
    return useQuery({
        queryKey: ['tipoKardex list'],
        queryFn: () => tipoKardexService.get(),
    })
}

export default useGetTipoKardexList