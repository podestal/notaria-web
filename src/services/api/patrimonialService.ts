import APIClient from "./apiClient"

export interface Patrimonial {
    itemmp: string
    kardex: string
    idtipoacto: string
    tipo_acto: string
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
}

export type PatrimonialCreate = Omit<Patrimonial, 'itemmp' | 'tipo_acto'>;

interface Props {
    byKardex: boolean
}

const getPatrimonialService = ({ byKardex }: Props) => {
    let url = '/patrimonial/'
    if (byKardex) {
        url = '/patrimonial/by_kardex/'
    }

    return new APIClient<Patrimonial, PatrimonialCreate>(url)
}

export default getPatrimonialService
