import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getActoCondicionService, {ActoCondicion} from "../../../services/api/actoCondicionService"

interface Props {
    idtipoacto: string
    access: string
    /** When false, the query does not run (e.g. parent modal closed). */
    enabled?: boolean
}
const useGetActoCondicionByTipoActo = ({ idtipoacto, access, enabled = true }: Props): UseQueryResult<ActoCondicion[]> => {
    const actoCondicionService = getActoCondicionService({ byTipoActo: true })
    const params = { tipoacto: idtipoacto }
    
    return useQuery({
        queryKey: ['actocondicion', 'by_tipoacto', idtipoacto],
        queryFn: () => actoCondicionService.get(access, params),
        enabled: enabled !== false && Boolean(idtipoacto?.trim() && access),
    })
}
export default useGetActoCondicionByTipoActo