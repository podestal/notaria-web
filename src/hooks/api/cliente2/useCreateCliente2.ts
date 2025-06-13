import { UseMutationResult, useMutation } from "@tanstack/react-query"
import getCliente2Service, { Cliente2, CreateUpdateCliente2 } from "../../../services/api/clienteService"

export interface CreateCliente2Data {
    access: string
    cliente: CreateUpdateCliente2
}

const useCreateCliente2 = (): UseMutationResult<Cliente2, Error, CreateCliente2Data> => {
    const cliente2Service = getCliente2Service({})

    return useMutation({
        mutationFn: async (data: CreateCliente2Data) => cliente2Service.post(data.cliente, data.access),
        onSuccess: res => {
            console.log(res)
        },
        onError: (error) => {
            console.error("Error creating Cliente2:", error)
        }
    })
}

export default useCreateCliente2


