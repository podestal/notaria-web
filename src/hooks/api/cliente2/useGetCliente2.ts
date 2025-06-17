import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getCliente2Service, { Cliente2 } from "../../../services/api/clienteService"

const useGetCliente2 = (): UseQueryResult<Cliente2, Error> => {

  const clienteService = getCliente2Service({})

  return useQuery({
    queryKey: ['clientes2'],
    queryFn: () => clienteService.get(),
  })
}
export default useGetCliente2