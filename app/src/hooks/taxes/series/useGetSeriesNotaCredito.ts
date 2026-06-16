import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import {
    notaCreditoSeriesService,
    type SerieControlInterno,
} from "../../../services/taxes/seriesService"
import { normalizeTaxesList } from "../../../services/taxes/normalizeTaxesList"

interface Props {
    access: string
    enabled?: boolean
}

const useGetSeriesNotaCredito = ({
    access,
    enabled = true,
}: Props): UseQueryResult<SerieControlInterno[], Error> => {
    return useQuery({
        queryKey: ["taxes-series-nota-credito"],
        queryFn: async () =>
            normalizeTaxesList(await notaCreditoSeriesService.get(access)),
        enabled: enabled && !!access,
    })
}

export default useGetSeriesNotaCredito
