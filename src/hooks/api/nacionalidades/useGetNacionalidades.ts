import { useQuery, UseQueryResult } from "@tanstack/react-query"
import nacionalidadesService, { Nacionalidad } from "../../../services/api/nacionalidadesService"

const useGetNacionalidades = (): UseQueryResult<Nacionalidad[], Error> => {
  return useQuery({
    queryKey: ['nacionalidades'],
    queryFn: () => nacionalidadesService.get(),
  })
}

export default useGetNacionalidades