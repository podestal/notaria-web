import { useQuery, UseQueryResult } from "@tanstack/react-query"
import cargosService, {Cargo} from "../../../services/api/cargosService"

interface Props {
  access: string
}

const useGetCargos = ({ access }: Props): UseQueryResult<Cargo[], Error> => {
  return useQuery({
    queryKey: ['cargos'],
    queryFn: () => cargosService.get(access)
    })
}

export default useGetCargos
