import { useQuery, UseQueryResult } from "@tanstack/react-query"
import nacionalidadesService, { Nacionalidad } from "../../../services/api/nacionalidadesService"

interface Props {
  access: string
}

const useGetNacionalidades = ({ access }: Props): UseQueryResult<Nacionalidad[], Error> => {
  return useQuery({
    queryKey: ['nacionalidades'],
    queryFn: () => nacionalidadesService.get(access),
  })
}

export default useGetNacionalidades