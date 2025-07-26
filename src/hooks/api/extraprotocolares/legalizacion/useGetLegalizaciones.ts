import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getLegalizacionService, {LegalizacionPage} from "../../../../services/api/extraprotocolares/legalizacionService"

interface Props {
    access: string
    page: number
}

const useGetLegalizaciones = ({ access, page }: Props): UseQueryResult<LegalizacionPage, Error> => {
    const legalizacionService = getLegalizacionService()
    const params = { page: page.toString() }

    return useQuery({
        queryKey: ['legalizaciones', params],
        queryFn: () => legalizacionService.get(access, params),
    })
}

export default useGetLegalizaciones