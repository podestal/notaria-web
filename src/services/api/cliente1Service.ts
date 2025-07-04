import APIClient from "./apiClient"

export interface Cliente {
    idcliente: string;
    tipper: string;
    apepat: string;
    apemat: string;
    prinom: string;
    segnom: string;
    nombre: string;
    direccion: string;
    idubigeo: string;
    idtipdoc: number;
    numdoc: string;
    email: string;
    telfijo: string;
    telcel: string;
    sexo?: string;
    telofi?: string;
    idestcivil?: number | null;
    nacionalidad?: string;
    idprofesion?: number | null;
    detaprofesion?: string | null;
    idcargoprofe?: number | null;
    cumpclie?: string; // Date in 'DD/MM/YYYY' format
    resedente?: string; // '1' for resident, '0' for non-resident
    razonsocial: string;
    domfiscal: string;
    
}

export type CreateUpdateCliente1 = Omit<Cliente, 'idcliente'> 

interface Props {
    clienteId: string
    byDni?: boolean
}

const getCliente1Service = ({ clienteId, byDni = false }: Props) => {
    let url = '/cliente/'
    if (byDni) {
        url = '/cliente/by_dni/'
    } else if (clienteId) {
        url = `/cliente/${clienteId}/`
    }
    return new APIClient<Cliente, CreateUpdateCliente1>(url)
}

export default getCliente1Service