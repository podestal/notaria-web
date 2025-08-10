import { useQuery, UseQueryResult } from "@tanstack/react-query";
import getPoderPensionService, { PoderPension} from "../../../../../services/api/extraprotocolares/poderPension";

interface Props {
    idPoder: number;
    access: string;
}

const useGetPoderPensionByPoder = ({ idPoder, access }: Props): UseQueryResult<PoderPension, Error> => {

    const poderPensionService = getPoderPensionService({ byPoder: true })
    const params: Record<string, string> = { id_poder: idPoder.toString() }

    return useQuery({
        queryKey: ["poder-pension", idPoder],
        queryFn: () => poderPensionService.get(access, params),
    })
}

export default useGetPoderPensionByPoder