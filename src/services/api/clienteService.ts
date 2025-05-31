import APIClient from "./apiClient"

// "idcontratante": "0000004508",
// "idcliente": "0000000007",
// "tipper": "N",
// "apepat": "CHAVEZ",
// "apemat": "HUMPIRI",
// "prinom": "ROXANA",
// "segnom": "",
// "nombre": "CHAVEZ HUMPIRI, ROXANA ",
// "direccion": "AVENIDA JULIACA N° 2215",
// "idtipdoc": 1,
// "numdoc": "47502562",
// "email": "",
// "telfijo": "",
// "telcel": "",
// "telofi": "",
// "sexo": "F",
// "idestcivil": 1,
// "natper": "JULIACA",
// "conyuge": "",
// "nacionalidad": "177",
// "idprofesion": 1,
// "detaprofesion": "ABOGADO",
// "idcargoprofe": 36,
// "profocupa": "OTROS",
// "dirfer": "",
// "idubigeo": "211101",
// "cumpclie": "06/01/1993",
// "fechaing": "",
// "razonsocial": "",
// "domfiscal": "",
// "telempresa": "",
// "mailempresa": "",
// "contacempresa": "",
// "fechaconstitu": "",
// "idsedereg": 1,
// "numregistro": "",
// "numpartida": "",
// "actmunicipal": "",
// "tipocli": "0",
// "impeingre": "",
// "impnumof": "",
// "impeorigen": "",
// "impentidad": "",
// "impremite": "",
// "impmotivo": "",
// "residente": "1",
// "docpaisemi": "",
// "partidaconyuge": null,
// "separaciondebienes": null,
// "idsedeconyuge": null,
// "profesion_plantilla": "ABOGADO",
// "ubigeo_plantilla": null

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
    idestcivil: number;
    natper: string;
    conyuge: string | null;
    nacionalidad: string;
    idprofesion: number | null; // Puede ser null si no se selecciona
    detaprofesion: string | null; // Puede ser null si no se selecciona
    idcargoprofe: number | null; // Puede ser null si no se selecciona
    profocupa: string | null; // Puede ser null si no se selecciona
    dirfer: string | null; // Puede ser null si no se selecciona
    idubigeo: string | null; // Puede ser null si no se selecciona
    cumpclie: Date | null; // Puede ser null si no se selecciona
    fechaing?: Date | null; // Puede ser opcional o nulo
    profesion_plantilla: string; 
}

export default new APIClient<Cliente2, Cliente2>('/cliente2/');