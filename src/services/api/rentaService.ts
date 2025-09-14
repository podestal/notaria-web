import APIClient from "./apiClient";

export interface Renta {
    idrenta: string
    idcontratante: string
    kardex: string
    pregu1: string
    pregu2: string
    pregu3: string
}

export type CreateUpdateRenta = Omit<Renta, 'idrenta'>

interface Props {
    byKardexAndContratante?: boolean
}

const getRentaService = ({ byKardexAndContratante }: Props) => {
    let url = 'renta/'

    if (byKardexAndContratante) {
        url += 'by-kardex-and-contratante/'
    }

    return new APIClient<Renta, CreateUpdateRenta>(url)
}

export default getRentaService