import APIClient from "./apiClient"

export interface Cliente2 {
    idcontratante: string;
    idcliente: string;
    tipper: string;
    apepat: string;
    apemat: string;
    prinom: string;
    segnom: string;
    nombre: string;
    direccion: string;
    idtipdoc: number;
    numdoc: string;
    email: string;
    telfijo: string;
    telcel: string;
    telofi: string;
    sexo: string;
    idestcivil?: number;
    natper: string;
    conyuge: string | null;
    nacionalidad: string;
    idprofesion: number | null; 
    detaprofesion: string; 
    idcargoprofe: number;
    profocupa: string;
    dirfer: string; 
    resedent?: string;
    idubigeo: string; 
    cumpclie: string ; 
    razonsocial: string;
    fechaing: string;
    residente: string;
    tipocli: string;
    profesion_plantilla: string; 
    ubigeo_plantilla: string;
    fechaconstitu: string
    idsedereg: number;
    domfiscal: string;
    numpartida: string;
    telempresa: string;
    actmunicipal: string;
    contacempresa: string;
}

export type CreateUpdateCliente2 = Omit<Cliente2, 'idcliente' | 'idcontratante'>

interface Props {
    clienteId?: string
    byContratante?: boolean
}

const getCliente2Service = ({ clienteId, byContratante }: Props) => {

    let url = '/cliente2/';
    if (clienteId) {
        url = `/cliente2/${clienteId}/`;
    } else if (byContratante) {
        url = `/cliente2/by_contratante/`;
    }
    return new APIClient<Cliente2, CreateUpdateCliente2>(url)
}

export default getCliente2Service