import { useQuery, UseQueryResult } from "@tanstack/react-query"
import clienteService, {Cliente2} from "../../../services/api/clienteService"

const useGetCliente2 = (): UseQueryResult<Cliente2[], Error> => {
  return useQuery({
    queryKey: ['clientes2'],
    queryFn: () => clienteService.get(),
  })
}
export default useGetCliente2