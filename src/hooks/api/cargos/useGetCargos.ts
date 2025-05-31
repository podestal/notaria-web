import { useQuery, UseQueryResult } from "@tanstack/react-query"
import cargosService, {Cargo} from "../../../services/api/cargosService"

const useGetCargos = (): UseQueryResult<Cargo[], Error> => {
  return useQuery({
    queryKey: ['cargos'],
    queryFn: () => cargosService.get()
    })
}

export default useGetCargos
