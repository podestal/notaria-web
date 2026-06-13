import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query"
import {
    getResumenConsultarTicketService,
    type Resumen,
} from "../../../services/taxes/resumenesService"

interface Props {
    id_resumen: number
}

interface ConsultarTicketData {
    access: string
}

const useConsultarResumenTicket = ({
    id_resumen,
}: Props): UseMutationResult<Resumen, Error, ConsultarTicketData> => {
    const queryClient = useQueryClient()
    const service = getResumenConsultarTicketService(id_resumen)

    return useMutation({
        mutationFn: (data: ConsultarTicketData) => service.post({}, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["taxes-resumenes"] })
        },
    })
}

export default useConsultarResumenTicket
