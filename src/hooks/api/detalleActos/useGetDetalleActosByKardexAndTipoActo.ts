import { useQuery, UseQueryResult } from "@tanstack/react-query"
import getDetalleActosKardeService, {DetalleActoKardex} from "../../../services/api/detalleActosKardexService"

interface Props {
    access: string
    kardex: string
    tipoacto: string
}

const useGetDetalleActosByKardexAndTipoActo = ({ access, kardex, tipoacto }: Props): UseQueryResult<DetalleActoKardex, Error> => {
    const detalleActosKardexService = getDetalleActosKardeService({ byKardexTipoActo: true })
    const params = { kardex, tipoacto }
    return useQuery({
        queryKey: ['detalleactos', 'byKardexTipoActo', kardex, tipoacto],
        queryFn: () => detalleActosKardexService.get(access, params),
    })
}
export default useGetDetalleActosByKardexAndTipoActo