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
    medios_pago_sum: number
}

export type PatrimonialCreateUpdate = Omit<Patrimonial, 'moneda' | 'medios_pago_sum'>;

interface Props {
    idPatrimonial?: string
    byKardex?: boolean
}

const getPatrimonialService = ({ byKardex, idPatrimonial }: Props) => {
    let url = '/patrimonial/'
    if (idPatrimonial) {
        url += `${idPatrimonial}/`
    }
    if (byKardex) {
        url = '/patrimonial/by_kardex/'
    }

    return new APIClient<Patrimonial, PatrimonialCreateUpdate>(url)
}

export default getPatrimonialService
