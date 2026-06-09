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

export default controlInternoSeriesService
