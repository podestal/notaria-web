import type { EmisionFormVariant } from "../../../components/taxes/comprobantes/comprobanteFormConfig"
import type { SerieControlInterno } from "../../../services/taxes/seriesService"
import useGetSeriesBoleta from "./useGetSeriesBoleta"
import useGetSeriesControlInterno from "./useGetSeriesControlInterno"
import useGetSeriesFactura from "./useGetSeriesFactura"
import useGetSeriesNotaCredito from "./useGetSeriesNotaCredito"

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
    const notaCredito = useGetSeriesNotaCredito({
        access,
        enabled: variant === "nota_credito",
    })

    if (variant === "boleta") {
        return { data: boleta.data ?? [], isLoading: boleta.isLoading }
    }

    if (variant === "factura") {
        return { data: factura.data ?? [], isLoading: factura.isLoading }
    }

    if (variant === "nota_credito") {
        return { data: notaCredito.data ?? [], isLoading: notaCredito.isLoading }
    }

    return {
        data: controlInterno.data ?? [],
        isLoading: controlInterno.isLoading,
    }
}

export default useGetSeriesForVariant
