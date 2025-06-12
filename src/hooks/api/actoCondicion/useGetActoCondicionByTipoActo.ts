import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getActoCondicionService, {ActoCondicion} from "../../../services/api/actoCondicionService"

interface Props {
    idtipoacto: string
}
const useGetActoCondicionByTipoActo = ({ idtipoacto }: Props): UseQueryResult<ActoCondicion[]> => {
    const actoCondicionService = getActoCondicionService({ byTipoActo: true })
    const params = { tipoacto: idtipoacto }
    
    return useQuery({
        queryKey: ['actocondicion', 'by_tipoacto', idtipoacto],
        queryFn: () => actoCondicionService.get('', params),
        enabled: !!idtipoacto, // Only run the query if idtipoacto is provided
    })
}
export default useGetActoCondicionByTipoActo