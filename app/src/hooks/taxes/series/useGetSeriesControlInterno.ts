import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import {
    controlInternoSeriesService,
    type SerieControlInterno,
} from "../../../services/taxes/seriesService"
import { normalizeTaxesList } from "../../../services/taxes/normalizeTaxesList"

interface Props {
    access: string
    enabled?: boolean
}

const useGetSeriesControlInterno = ({
    access,
    enabled = true,
}: Props): UseQueryResult<SerieControlInterno[], Error> => {
    return useQuery({
        queryKey: ["taxes-series-control-interno"],
        queryFn: async () =>
            normalizeTaxesList(await controlInternoSeriesService.get(access)),
        enabled: enabled && !!access,
    })
}

export default useGetSeriesControlInterno
