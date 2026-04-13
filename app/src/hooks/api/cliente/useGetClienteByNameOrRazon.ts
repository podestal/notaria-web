import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getCliente1Service, { ClientePage } from "../../../services/api/cliente1Service"

interface Props {
    access: string
    nameOrRazon: string
    page: number
}

const useGetClienteByNameOrRazon = ({ access, nameOrRazon, page }: Props): UseQueryResult<ClientePage, Error> => {

    const clienteService = getCliente1Service({ byNameOrRazon: true })
    const params: Record<string, string> = {
        name: nameOrRazon,
        page: page.toString(),
    }
    return useQuery({
        queryKey: ['by_name_or_razon', nameOrRazon, page],
        queryFn: () => clienteService.get(access, params),
        enabled: !!nameOrRazon,
    })
}

export default useGetClienteByNameOrRazon