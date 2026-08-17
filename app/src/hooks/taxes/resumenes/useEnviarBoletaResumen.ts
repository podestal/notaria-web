import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import {
    resumenesEnviarBoletaService,
    type EnviarBoletaPayload,
    type EnviarBoletaResponse,
} from "../../../services/taxes/resumenesService"

export interface EnviarBoletaResumenData {
    access: string
    payload: EnviarBoletaPayload
}

const useEnviarBoletaResumen = (): UseMutationResult<
    EnviarBoletaResponse,
    Error,
    EnviarBoletaResumenData
> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: EnviarBoletaResumenData) =>
            resumenesEnviarBoletaService.post(data.payload, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes-resumenes"] })
            queryClient.invalidateQueries({
                queryKey: ["taxes-resumen-recibos-pendientes"],
            })
            queryClient.invalidateQueries({ queryKey: ["taxes-recibos"] })
        },
    })
}

export default useEnviarBoletaResumen
