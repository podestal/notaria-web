import APIClient from "./apiClient"

// "item": 57547,
// "kardex": "ACT411-2025",
// "idtipoacto": "092",
// "actosunat": "",
// "actouif": "",
// "idtipkar": 3,
// "desacto": "ADJUDICACION"

export interface DetalleActoKardex {
    item: number;
    kardex: string;
    idtipoacto: string;
    actosunat: string;
    actouif: string;
    idtipkar: number;
    desacto: string;
}

interface Props {
    byKardexTipoActo: boolean
}

const getDetalleActosKardeService = ({ byKardexTipoActo }: Props) => {
    let url = '/detalleactos/'
    if (byKardexTipoActo) {
        url += 'by_kardex_tipoacto/'
    }

    return new APIClient<DetalleActoKardex>(url)
}

export default getDetalleActosKardeService
