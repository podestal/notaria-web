import TaxesClient from "./taxesCliente"

export interface SerieControlInterno {
    id_serie: number
    serie: string
    sede_id: number
    comprobante: number
}

export const controlInternoSeriesService = new TaxesClient<SerieControlInterno[]>(
    "/series/control_interno/",
)

export const boletaSeriesService = new TaxesClient<SerieControlInterno[]>(
    "/series/boleta/",
)

export const facturaSeriesService = new TaxesClient<SerieControlInterno[]>(
    "/series/factura/",
)

export const notaCreditoSeriesService = new TaxesClient<SerieControlInterno[]>(
    "/series/nota-credito/",
)

export const notaDebitoSeriesService = new TaxesClient<SerieControlInterno[]>(
    "/series/nota-debito/",
)

export default controlInternoSeriesService
