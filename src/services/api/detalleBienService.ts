import APIClient from "./apiClient"

export interface DetalleBien {
    detbien: number
    itemmp: string
    kardex: string
    idtipacto: string
    tipob: string
    idtipbien: number
    coddis: string
    fechaconst: string
    oespecific: string
    smaquiequipo: string
    tpsm: string
    npsm: string
    pregistral: string
    idsedereg: string
}

export type DetalleBienCreateUpdate = Omit<DetalleBien, 'detbien' | 'itemmp' | 'kardex'>;

interface Props {
    detalleBienId?: number
    byKardex?: boolean
}

const getDetalleBienService = ({ detalleBienId, byKardex }: Props) => {
    let endpoint = '/detallebienes/'
    if (detalleBienId) {
        endpoint += `${detalleBienId}/`
    } else if (byKardex) {
        endpoint += 'by_kardex/'
    }
    return new APIClient<DetalleBien, DetalleBienCreateUpdate>(endpoint);
}

export default getDetalleBienService