import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getPrediosService, { Predio } from "../../../services/api/prediosService"

interface Props {
    access: string
    kardex: string
}

const useGetPrediosByKardex = ({ access, kardex }: Props): UseQueryResult<Predio[], Error> => {
    const prediosService = getPrediosService({ byKardex: true })
    const params = { kardex }
    return useQuery({
        queryKey: ['prediosByKardex', kardex],
        queryFn: () => prediosService.get(access, params),
    })
}

export default useGetPrediosByKardex