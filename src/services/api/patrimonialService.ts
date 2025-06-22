import APIClient from "./apiClient"

export interface Patrimonial {
    itemmp: string
    kardex: string
    idtipoacto: string
    nminuta: string
    idmon: number
    tipocambio: string
    importetrans: number
    exhibiomp: string
    presgistral: string
    nregistral: string
    idsedereg: string
    fpago: string
    idoppago: string
    ofondos: string
    item: number
    des_idoppago?: string | null
    moneda: string
}

export type PatrimonialCreateUpdate = Omit<Patrimonial, 'moneda'>;

interface Props {
    byKardex?: boolean
}

const getPatrimonialService = ({ byKardex }: Props) => {
    let url = '/patrimonial/'
    if (byKardex) {
        url = '/patrimonial/by_kardex/'
    }

    return new APIClient<Patrimonial, PatrimonialCreateUpdate>(url)
}

export default getPatrimonialService
