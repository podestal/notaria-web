import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getDetalleBienService, { DetalleBien } from "../../../services/api/detalleBienService"

interface Props {
    access: string
    kardex: string
}

const useGetDetalleBienesByKardex = ({ access, kardex }: Props): UseQueryResult<DetalleBien[], Error> => {
    const detalleBienService = getDetalleBienService({ byKardex: true })
    const params = { kardex }
    return useQuery({

        queryKey: ['detalleBienesByKardex', kardex],
        queryFn: () => detalleBienService.get(access, params),
    })
}

export default useGetDetalleBienesByKardex