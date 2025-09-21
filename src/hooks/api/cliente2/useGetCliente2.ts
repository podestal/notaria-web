import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getCliente2Service, { Cliente2 } from "../../../services/api/clienteService"

interface Props {
  access: string
}

const useGetCliente2 = ({ access }: Props): UseQueryResult<Cliente2, Error> => {

  const clienteService = getCliente2Service({})

  return useQuery({
    queryKey: ['clientes2'],
    queryFn: () => clienteService.get(access),
  })
}
export default useGetCliente2