import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query"
import getCliente2Service, { Cliente2, CreateUpdateCliente2 } from "../../../services/api/clienteService"

export interface UpdateCliente2Data {
    access: string
    cliente: CreateUpdateCliente2
}

interface Props {
    clienteId: string
}
const useUpdateCliente2 = ({ clienteId }: Props): UseMutationResult<Cliente2, Error, UpdateCliente2Data> => {
    const clienteService = getCliente2Service({ clienteId })
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: UpdateCliente2Data) => clienteService.update(data.cliente, data.access),
        onSuccess: res => {
            console.log('Cliente2 updated successfully', res);
            queryClient.invalidateQueries({ queryKey: ['clientes2'] })
        },
        onError: (error) => {
            console.error("Error updating Cliente2:", error)
        }
    })
}
export default useUpdateCliente2