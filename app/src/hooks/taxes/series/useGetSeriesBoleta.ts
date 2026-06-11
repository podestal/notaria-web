import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import {
    boletaSeriesService,
    type SerieControlInterno,
} from "../../../services/taxes/seriesService"
import { normalizeTaxesList } from "../../../services/taxes/normalizeTaxesList"

interface Props {
    access: string
    enabled?: boolean
}

const useGetSeriesBoleta = ({
    access,
    enabled = true,
}: Props): UseQueryResult<SerieControlInterno[], Error> => {
    return useQuery({
        queryKey: ["taxes-series-boleta"],
        queryFn: async () =>
            normalizeTaxesList(await boletaSeriesService.get(access)),
        enabled: enabled && !!access,
    })
}

export default useGetSeriesBoleta
