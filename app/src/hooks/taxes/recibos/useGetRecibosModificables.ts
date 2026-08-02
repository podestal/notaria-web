import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import {
    getRecibosModificables,
    type RecibosModificablesFilters,
    type RecibosPage,
} from "../../../services/taxes/recibosService"

type Props = RecibosModificablesFilters & {
    access: string
    enabled?: boolean
}

const useGetRecibosModificables = ({
    access,
    enabled = true,
    page = 1,
    page_size = 10,
    comprobante_id = "",
    serie = "",
    numero = "",
    aceptada_sunat = "",
    fecha_emision_desde = "",
    fecha_emision_hasta = "",
    kardex = "",
    has_kardex = "",
    persona_documento = "",
    persona_nombres = "",
    usuario = "",
}: Props): UseQueryResult<RecibosPage, Error> => {
    const filters: RecibosModificablesFilters = {
        page,
        page_size,
        comprobante_id: comprobante_id || undefined,
        serie: serie || undefined,
        numero: numero || undefined,
        aceptada_sunat: aceptada_sunat || undefined,
        fecha_emision_desde: fecha_emision_desde || undefined,
        fecha_emision_hasta: fecha_emision_hasta || undefined,
        kardex: kardex || undefined,
        has_kardex: has_kardex || undefined,
        persona_documento: persona_documento || undefined,
        persona_nombres: persona_nombres || undefined,
        usuario: usuario || undefined,
    }

    return useQuery({
        queryKey: [
            "taxes-recibos-modificables",
            page,
            page_size,
            comprobante_id,
            serie,
            numero,
            aceptada_sunat,
            fecha_emision_desde,
            fecha_emision_hasta,
            kardex,
            has_kardex,
            persona_documento,
            persona_nombres,
            usuario,
        ],
        queryFn: () => getRecibosModificables(access, filters),
        enabled: enabled && Boolean(access),
        refetchOnWindowFocus: false,
    })
}

export default useGetRecibosModificables
