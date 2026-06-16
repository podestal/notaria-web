import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import {
    notaDebitoSeriesService,
    type SerieControlInterno,
} from "../../../services/taxes/seriesService"
import { normalizeTaxesList } from "../../../services/taxes/normalizeTaxesList"

interface Props {
    access: string
    enabled?: boolean
}

const useGetSeriesNotaDebito = ({
    access,
    enabled = true,
}: Props): UseQueryResult<SerieControlInterno[], Error> => {
    return useQuery({
        queryKey: ["taxes-series-nota-debito"],
        queryFn: async () =>
            normalizeTaxesList(await notaDebitoSeriesService.get(access)),
        enabled: enabled && !!access,
        retry: false,
    })
}

export default useGetSeriesNotaDebito
