import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getFormularioService, { Formulario, CreateUpdateFormulario } from "../../../services/api/formularioService"

interface CreateFormularioData {
    access: string
    formulario: CreateUpdateFormulario
}

interface Props {
    idrenta: string
}

const useCreateFormulario = ({ idrenta }: Props): UseMutationResult<Formulario, Error, CreateFormularioData> => {
    const formularioService = getFormularioService({ })
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateFormularioData) => formularioService.post(data.formulario, data.access),
        onSuccess: res => {
            queryClient.invalidateQueries({ queryKey: ['formulario', idrenta] })
            console.log('Formulario creado correctamente', res)
            
        },
        onError: (error) => {
            console.log(error)
        }
    })
}

export default useCreateFormulario