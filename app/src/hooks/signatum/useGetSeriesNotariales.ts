import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { serieNotarialService, SerieNotarial } from "../../services/signatum/serieNotarialService"

interface GetSeriesNotarialesProps {
  access: string
  idtipkar: number
}

const useGetSeriesNotariales = ({
  access,
  idtipkar,
}: GetSeriesNotarialesProps): UseQueryResult<SerieNotarial[], Error> => {
  return useQuery({
    queryKey: ["signatum", "series-notariales", idtipkar],
    queryFn: () =>
      serieNotarialService.get(access, { idtipkar: String(idtipkar) }),
    enabled: Boolean(access) && Number.isFinite(idtipkar),
  })
}

export default useGetSeriesNotariales

