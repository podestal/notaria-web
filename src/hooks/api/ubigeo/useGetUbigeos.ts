import { useQuery, UseQueryResult } from "@tanstack/react-query"
import ubigeoService, { Ubigeo } from "../../../services/api/ubigeoService"

interface Props {
    access: string
}

const useGetUbigeos = ({ access }: Props): UseQueryResult<Ubigeo[], Error> => {
    return useQuery({
        queryKey: ['ubigeos'],
        queryFn: () => ubigeoService.get(access),
    })
}

export default useGetUbigeos