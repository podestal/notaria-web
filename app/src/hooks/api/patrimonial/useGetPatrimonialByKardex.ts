import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getPatrimonialService, { Patrimonial } from "../../../services/api/patrimonialService"

interface Props {
    access: string
    kardex: string
}
const useGetPatrimonialByKardex = ({ access, kardex }: Props): UseQueryResult<Patrimonial[]> => {
    const patrimonialService = getPatrimonialService({ byKardex: true })
    const params = { kardex }
    return useQuery({
        queryKey: ['patrimonial by kardex', kardex],
        queryFn: () => patrimonialService.get(access, params),

    })
}
export default useGetPatrimonialByKardex