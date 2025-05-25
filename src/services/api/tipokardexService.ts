import APIClient from "./apiClient"

export interface Tipokardex {
    idtipkar: number
    nomtipkar: string
    tipkar: string
}

const getTipokardexService = () => {
    return new APIClient<Tipokardex, Tipokardex>('/tipokar/')
}

export default getTipokardexService