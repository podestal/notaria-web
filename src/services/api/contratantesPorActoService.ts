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
}

export type CreateUpdateContratantesPorActo = Omit<ContratantesPorActo, 'id' | 'cliente' | 'cliente_id' | 'condicion_str'>

interface Props {
    byKardex: boolean
}

const getContratantesPorActoService = ({ byKardex }: Props) => {
    let url = '/contratantesxacto/'
    if (byKardex) {
        url += 'by_kardex/'
    }
    return new APIClient<ContratantesPorActo, CreateUpdateContratantesPorActo>(url)
}

export default getContratantesPorActoService