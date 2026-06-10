import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import recibosService, { type RecibosPage } from "../../../services/taxes/recibosService"

interface Props {
    access: string
    page?: number
    comprobante?: number
    fecha_emision_desde?: string
    fecha_emision_hasta?: string
    persona_documento?: string
    persona_nombres?: string
    usuario?: string
    enabled?: boolean
}

const useGetRecibos = ({
    access,
    page = 1,
    comprobante,
    fecha_emision_desde = "",
    fecha_emision_hasta = "",
    persona_documento = "",
    persona_nombres = "",
    usuario = "",
    enabled = true,
}: Props): UseQueryResult<RecibosPage, Error> => {
    const params: Record<string, string> = {
        page: String(page),
    }
    if (comprobante != null) params.comprobante_id = String(comprobante)
    if (fecha_emision_desde.trim()) {
        params.fecha_emision_desde = fecha_emision_desde.trim()
    }
    if (fecha_emision_hasta.trim()) {
        params.fecha_emision_hasta = fecha_emision_hasta.trim()
    }
    if (persona_documento.trim()) params.persona_documento = persona_documento.trim()
    if (persona_nombres.trim()) params.persona_nombres = persona_nombres.trim()
    if (usuario.trim()) params.usuario = usuario.trim()

    return useQuery({
        queryKey: [
            "taxes-recibos",
            comprobante ?? "all",
            page,
            fecha_emision_desde.trim(),
            fecha_emision_hasta.trim(),
            persona_documento.trim(),
            persona_nombres.trim(),
            usuario.trim(),
        ],
        queryFn: () => recibosService.get(access, params),
        enabled: enabled && !!access,
    })
}

export default useGetRecibos
