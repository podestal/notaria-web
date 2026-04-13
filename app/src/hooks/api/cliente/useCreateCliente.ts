import { UseMutationResult, useMutation } from "@tanstack/react-query"
import getCliente1Service, { Cliente, CreateUpdateCliente1 } from "../../../services/api/cliente1Service"

export interface CreateClienteData {
    access: string
    cliente: CreateUpdateCliente1
}

const useCreateCliente = (): UseMutationResult<Cliente, Error, CreateClienteData> => {
    const clienteService = getCliente1Service({ clienteId: '' })

    return useMutation({
        mutationFn: (data: CreateClienteData) => clienteService.post(data.cliente, data.access),
        onSuccess: (data) => {
            console.log("Cliente created successfully:", data)
            
        },
        onError: (error) => {
            console.error("Error creating cliente:", error)
        },
    })
}
export default useCreateCliente