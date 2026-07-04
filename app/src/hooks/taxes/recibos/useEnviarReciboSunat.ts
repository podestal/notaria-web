import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import {
    getReciboEnviarSunatService,
    type EnviarReciboSunatResponse,
} from "../../../services/taxes/recibosService"

interface EnviarReciboSunatData {
    access: string
}

interface Props {
    id_recibo: number
}

const useEnviarReciboSunat = ({
    id_recibo,
}: Props): UseMutationResult<EnviarReciboSunatResponse, Error, EnviarReciboSunatData> => {
    const queryClient = useQueryClient()
    const service = getReciboEnviarSunatService(id_recibo)

    return useMutation({
        mutationFn: (data: EnviarReciboSunatData) =>
            service.post({}, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes-recibos"] })
        },
    })
}

export default useEnviarReciboSunat
