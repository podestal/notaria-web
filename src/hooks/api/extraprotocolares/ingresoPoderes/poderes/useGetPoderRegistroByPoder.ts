import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getPoderRegistroService, { PoderRegistro } from "../../../../../services/api/extraprotocolares/poderRegistroService"

interface Props {
    access: string;
    poderId: number;
}

const useGetPoderRegistroByPoder = ({ access,poderId }: Props): UseQueryResult<PoderRegistro, Error> => {
    const poderRegistroService = getPoderRegistroService({ byPoder: true })
    const params: Record<string, string> = { id_poder: poderId.toString() }
    return useQuery({
        queryKey: ['poderRegistro', poderId],
        queryFn: () => poderRegistroService.get(access,params),
    })
}

export default useGetPoderRegistroByPoder