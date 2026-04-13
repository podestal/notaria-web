import { useQuery, UseQueryResult } from "@tanstack/react-query";
import getPoderPensionService, { PoderPension} from "../../../../../services/api/extraprotocolares/poderPension";

interface Props {
    poderId: number;
    access: string;
}

const useGetPoderPensionByPoder = ({ poderId, access }: Props): UseQueryResult<PoderPension, Error> => {

    const poderPensionService = getPoderPensionService({ byPoder: true })
    const params: Record<string, string> = { id_poder: poderId.toString() }

    return useQuery({
        queryKey: ["poder-pension", poderId],
        queryFn: () => poderPensionService.get(access, params),
    })
}

export default useGetPoderPensionByPoder