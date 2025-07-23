import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getLegalizacionService, {LegalizacionPage} from "../../../../services/api/extraprotocolares/legalizacionService"

interface Props {
    access: string
}

const useGetLegalizaciones = ({ access }: Props): UseQueryResult<LegalizacionPage, Error> => {
    const legalizacionService = getLegalizacionService()

    return useQuery({
        queryKey: ['legalizaciones'],
        queryFn: () => legalizacionService.get(access),
    })
}

export default useGetLegalizaciones