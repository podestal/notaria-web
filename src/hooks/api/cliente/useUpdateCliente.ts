import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getCliente1Service, { Cliente, CreateUpdateCliente1 } from "../../../services/api/cliente1Service"

export interface UpdateClienteData {
    access: string
    cliente: CreateUpdateCliente1
}

interface Props {
    clienteId: string
    dni: string
}

const useUpdateCliente = ({clienteId, dni}: Props): UseMutationResult<Cliente, Error, UpdateClienteData> => {
    const clienteService = getCliente1Service({ clienteId })
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: UpdateClienteData) => clienteService.update(data.cliente, data.access),
        onSuccess: (data) => {
            console.log("Cliente updated successfully:", data)
            // Invalidate the query to refetch the updated cliente
            queryClient.invalidateQueries({ queryKey: ['cliente', 'by_dni', dni] })
        },
        onError: (error) => {
            console.error("Error updating cliente:", error)
        },
    })
}
export default useUpdateCliente
