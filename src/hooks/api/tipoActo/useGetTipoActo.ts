import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getTipoActosService, { TipoActo } from "../../../services/api/tipoActosService"

const useGetTipoActo = (): UseQueryResult<TipoActo[]> => {
    const tipoActosService = getTipoActosService({  })
    return useQuery({
        queryKey: ['tipoActos'],
        queryFn: () => tipoActosService.get(),
        refetchOnWindowFocus: false,
    })
}

export default useGetTipoActo