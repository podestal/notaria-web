import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getCliente1Service, { Cliente } from "../../../services/api/cliente1Service"

interface  Props {
    dni: string
}

const useGetClienteByDni = ({ dni }: Props): UseQueryResult<Cliente> => {
    const clienteService = getCliente1Service({ clienteId: '', byDni: true })
    const params = { dni }
    return useQuery({
        queryKey: ['cliente', 'by_dni', dni],
        queryFn: () => clienteService.get('', params),
    })
}
export default useGetClienteByDni