import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { serieNotarialService, SerieNotarial } from "../../services/signatum/serieNotarialService"

interface GetSeriesNotarialesProps {
  access: string
}

const useGetSeriesNotariales = ({
  access,
}: GetSeriesNotarialesProps): UseQueryResult<SerieNotarial[], Error> => {
  return useQuery({
    queryKey: ["signatum", "series-notariales"],
    queryFn: () => serieNotarialService.get(access),
  })
}

export default useGetSeriesNotariales

