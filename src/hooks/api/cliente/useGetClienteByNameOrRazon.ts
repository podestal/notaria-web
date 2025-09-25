import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getCliente1Service, { ClientePage } from "../../../services/api/cliente1Service"

interface Props {
    access: string
    nameOrRazon: string
}

const useGetClienteByNameOrRazon = ({ access, nameOrRazon }: Props): UseQueryResult<ClientePage, Error> => {

    const clienteService = getCliente1Service({ byNameOrRazon: true })
    const params: Record<string, string> = {
        name: nameOrRazon,
    }
    return useQuery({
        queryKey: ['by_name_or_razon', nameOrRazon],
        queryFn: () => clienteService.get(access, params),
        enabled: false,
    })
}

export default useGetClienteByNameOrRazon