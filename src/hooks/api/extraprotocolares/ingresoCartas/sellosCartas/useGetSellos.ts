import { useQuery, UseQueryResult } from "@tanstack/react-query"
import sellosCartasService, { SellosCartas } from "../../../../../services/api/extraprotocolares/sellosCartasService"

interface Props {
    access: string
}

const useGetSellos = ({ access }: Props): UseQueryResult<SellosCartas[], Error> => {
    return useQuery({
        queryKey: ['sellos-cartas'],
        queryFn: () => sellosCartasService.get(access),
    })
}

export default useGetSellos