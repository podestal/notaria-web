import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getTipoActosService, { TipoActo } from "../../../services/api/tipoActosService"

interface Props {
    access: string
    /** When false, the query does not run (e.g. screens that do not need actos). */
    enabled?: boolean
}

const useGetTipoActo = ({ access, enabled = true }: Props): UseQueryResult<TipoActo[]> => {
    const tipoActosService = getTipoActosService({  })
    return useQuery({
        queryKey: ['tipoActos'],
        queryFn: () => tipoActosService.get(access),
        refetchOnWindowFocus: false,
        enabled: enabled && !!access,
    })
}

export default useGetTipoActo