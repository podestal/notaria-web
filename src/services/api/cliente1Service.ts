import APIClient from "./apiClient"

// {"idcliente": "0000104251",
//     "tipper": "N",
//     "apepat": "Rodriguez",
//     "apemat": "Ugarteche",
//     "prinom": "Cneo",
//     "segnom": "Emilio Paulo",
//     "nombre": "Cneo Emilio Paulo Rodriguez Ugarteche",
//     "direccion": "217 first street",
//     "idubigeo": "",
//     "idtipdoc": 1,
//     "numdoc": "55667788",
//     "email": "",
//     "telfijo": "",
//     "telcel": "",
//     "sexo": "",
//     "idestcivil": null,
//     "nacionalidad": "",
//     "idprofesion": null,
//     "detaprofesion": null,
//     "idcargoprofe": null,
//     "cumpclie": "14/08/1976",
// }

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