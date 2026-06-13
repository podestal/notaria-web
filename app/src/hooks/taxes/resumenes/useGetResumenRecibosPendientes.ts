import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { resumenesRecibosPendientesService } from "../../../services/taxes/resumenesService"
import type { Recibo } from "../../../services/taxes/recibosService"
import { normalizeTaxesList } from "../../../services/taxes/normalizeTaxesList"

interface Props {
    access: string
    fecha_emision: string
    comprobante_id: number
    enabled?: boolean
}

const useGetResumenRecibosPendientes = ({
    access,
    fecha_emision,
    comprobante_id,
    enabled = true,
}: Props): UseQueryResult<Recibo[], Error> => {
    const trimmed = fecha_emision.trim()

    return useQuery({
        queryKey: [
            "taxes-resumen-recibos-pendientes",
            comprobante_id,
            trimmed,
        ],
        queryFn: async () =>
            normalizeTaxesList<Recibo>(
                await resumenesRecibosPendientesService.get(access, {
                    fecha_emision: trimmed,
                    comprobante_id: String(comprobante_id),
                }),
            ),
        enabled: enabled && !!access && !!trimmed && comprobante_id > 0,
    })
}

export default useGetResumenRecibosPendientes
