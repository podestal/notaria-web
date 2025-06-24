import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { Kardex, getSingleKardexService } from "../../../services/api/kardexService"

interface Props {
    id: number
    enabled: boolean
}

const useRetrieveKardex = ({ id, enabled }: Props): UseQueryResult<Kardex, Error> => {
    const kardexService = getSingleKardexService({ id })

    return useQuery({
        queryKey: ['kardex', id],
        queryFn: () => kardexService.get(),
        enabled: enabled
    })
}

export default useRetrieveKardex