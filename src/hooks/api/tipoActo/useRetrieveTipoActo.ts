import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getTipoActosService, { TipoActo } from "../../../services/api/tipoActosService"

interface Props {
    access: string
    idtipoacto: string
}

const useRetrieveTipoActo = ({ access, idtipoacto }: Props): UseQueryResult<TipoActo, Error> => {
    const tipoActosService = getTipoActosService({ idtipoacto })

    return useQuery({
        queryKey: ['tipoactos', idtipoacto],
        queryFn: () => tipoActosService.get(access),

    })
}

export default useRetrieveTipoActo