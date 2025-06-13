import { UseMutationResult, useMutation } from "@tanstack/react-query"
import getCliente2Service, { Cliente2, CreateUpdateCliente2 } from "../../../services/api/clienteService"

export interface CreateCliente2Data {
    access: string
    cliente2: CreateUpdateCliente2
}

const useCreateCliente2 = (): UseMutationResult<Cliente2, Error, CreateCliente2Data> => {
    const cliente2Service = getCliente2Service({})

    return useMutation({
        mutationFn: (data: CreateCliente2Data) => cliente2Service.post(data.cliente2, data.access),
        onSuccess: res => {
            console.log('cliente2 created successfully:', res)
        },
        onError: (error) => {
            console.error("Error creating Cliente2:", error)
        }
    })
}

export default useCreateCliente2


