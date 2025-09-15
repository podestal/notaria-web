import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getFormularioService, { Formulario } from "../../../services/api/formularioService"

interface RemoveFormularioData {
    access: string
}

interface Props {
    idformulario: number
    idrenta: string
}

const useRemoveFormulario = ({ idformulario, idrenta }: Props): UseMutationResult<Formulario, Error, RemoveFormularioData> => {
    const queryClient = useQueryClient()
    const formularioService = getFormularioService({ id: idformulario })

    return useMutation({
        mutationFn: (data: RemoveFormularioData) => formularioService.delete(data.access),
        onSuccess: res => {
            console.log('Formulario eliminado correctamente', res)
            queryClient.invalidateQueries({ queryKey:['formulario', idrenta] })
        },
        onError: (error) => {
            console.error('Error al eliminar el formulario:', error)
        }
    })
}

export default useRemoveFormulario