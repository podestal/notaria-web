import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getCliente1Service, { Cliente } from "../../../services/api/cliente1Service"

interface Props {
    access: string
    id: string
}

const useRetrieveClient = ({ access, id }: Props): UseQueryResult<Cliente, Error> => {
    const clienteService = getCliente1Service({ clienteId: id})
    return useQuery({
        queryKey: ['cliente', id],
        queryFn: () => clienteService.get(access),
        enabled: !!id,
    })
}

export default useRetrieveClient