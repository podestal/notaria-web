import type { EmisionFormVariant } from "../../../components/taxes/comprobantes/comprobanteFormConfig"
import type { SerieControlInterno } from "../../../services/taxes/seriesService"
import useGetSeriesBoleta from "./useGetSeriesBoleta"
import useGetSeriesControlInterno from "./useGetSeriesControlInterno"
import useGetSeriesFactura from "./useGetSeriesFactura"

interface Props {
    access: string
    variant: EmisionFormVariant
}

interface SeriesQueryResult {
    data: SerieControlInterno[]
    isLoading: boolean
}

const useGetSeriesForVariant = ({ access, variant }: Props): SeriesQueryResult => {
    const controlInterno = useGetSeriesControlInterno({
        access,
        enabled: variant === "ingreso",
    })
    const boleta = useGetSeriesBoleta({
        access,
        enabled: variant === "boleta",
    })
    const factura = useGetSeriesFactura({
        access,
        enabled: variant === "factura",
    })

    if (variant === "boleta") {
        return { data: boleta.data ?? [], isLoading: boleta.isLoading }
    }

    if (variant === "factura") {
        return { data: factura.data ?? [], isLoading: factura.isLoading }
    }

    return {
        data: controlInterno.data ?? [],
        isLoading: controlInterno.isLoading,
    }
}

export default useGetSeriesForVariant
