import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { Kardex, getSingleKardexService } from "../../../services/api/kardexService"

interface Props {
    id: number
    enabled: boolean
    access: string
}

const useRetrieveKardex = ({ id, enabled, access }: Props): UseQueryResult<Kardex, Error> => {
    const kardexService = getSingleKardexService({ id })

    return useQuery({
        queryKey: ['kardex', id],
        queryFn: () => kardexService.get(access),
        enabled: enabled
    })
}

export default useRetrieveKardex