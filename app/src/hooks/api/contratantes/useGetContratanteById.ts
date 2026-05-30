import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getContratantesService, { Contratante } from "../../../services/api/contratantesService"
import useAuthStore from "../../../store/useAuthStore"

interface Props {
    contratanteId: string
    enabled?: boolean
}

const useGetContratanteById = ({
    contratanteId,
    enabled = true,
}: Props): UseQueryResult<Contratante, Error> => {
    const access = useAuthStore((state) => state.access_token) || ""
    const contratantesService = getContratantesService({ contratanteId })

    return useQuery({
        queryKey: ["contratante", contratanteId],
        queryFn: () => contratantesService.get(access),
        enabled: enabled && !!contratanteId && !!access,
    })
}

export default useGetContratanteById
