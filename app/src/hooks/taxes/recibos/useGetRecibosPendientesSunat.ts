import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import {
    recibosPendientesSunatService,
    type Recibo,
} from "../../../services/taxes/recibosService"
import { normalizeTaxesList } from "../../../services/taxes/normalizeTaxesList"

interface Props {
    access: string
    fecha_emision: string
    enabled?: boolean
}

const useGetRecibosPendientesSunat = ({
    access,
    fecha_emision,
    enabled = true,
}: Props): UseQueryResult<Recibo[], Error> => {
    const trimmed = fecha_emision.trim()

    return useQuery({
        queryKey: ["taxes-recibos-pendientes-sunat", trimmed],
        queryFn: async () =>
            normalizeTaxesList(
                await recibosPendientesSunatService.get(access, {
                    fecha_emision: trimmed,
                }),
            ),
        enabled: enabled && !!access && !!trimmed,
    })
}

export default useGetRecibosPendientesSunat
