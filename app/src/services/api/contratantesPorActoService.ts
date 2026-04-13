import APIClient from "./apiClient"

export interface ContratantesPorActo {
    id: number
    idtipkar: number
    kardex: string
    idtipoacto: string
    idcontratante: string
    item: number
    idcondicion: string
    parte: string
    porcentaje: string
    uif: string
    formulario: string
    monto: string
    opago: string
    ofondo: string
    montop: string
    cliente: string
    cliente_id: string
    condicion_str: string
    renta: {
            idrenta: string
            idcontratante: string
            kardex: string
            pregu1: string
            pregu2: string
            pregu3: string
        }
    }


export type CreateUpdateContratantesPorActo = Omit<ContratantesPorActo, 'id' | 'cliente' | 'cliente_id' | 'condicion_str' | 'renta'>

interface Props {
    byKardex?: boolean
    id?: number
}

const getContratantesPorActoService = ({ byKardex, id }: Props) => {
    let url = '/contratantesxacto/'
    if (byKardex) {
        url += 'by_kardex/'
    } else if (id) {
        url += id + '/'
    }
    return new APIClient<ContratantesPorActo, CreateUpdateContratantesPorActo>(url)
}

export default getContratantesPorActoService