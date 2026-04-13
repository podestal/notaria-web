import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getTipoActosService, { TipoActo } from "../../../services/api/tipoActosService"

interface Props {
    access: string
}

const useGetTipoActo = ({ access }: Props): UseQueryResult<TipoActo[]> => {
    const tipoActosService = getTipoActosService({  })
    return useQuery({
        queryKey: ['tipoActos'],
        queryFn: () => tipoActosService.get(access),
        refetchOnWindowFocus: false,
    })
}

export default useGetTipoActo