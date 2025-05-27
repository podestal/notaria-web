import APIClient from "./apiClient"

export interface Usuario {
    idusuario: number;
    loginusuario: string;
    password: string;
    apepat: string;
    apemat: string;
    prinom: string;
    segnom: string;
    fecnac: string;
    estado: number;
    domicilio: string;
    idubigeo: number;
    telefono: string;
    idcargo: number;
    dni: string;
}

export default new APIClient<Usuario, Usuario>('/usuarios/')