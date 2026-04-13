import SisgenClient from "./sisgenClient";

export interface SisgenDoc {
    idkardex: string;
    kardex: string;
    numescritura: string;
    fechaescritura: string;
    estado_sisgen: string;
    idtipkar: number;
    fechaingreso: string;
    codactos: string;
    contrato: string;
    folioini: string;
    foliofin: string;
    fechaconclusion: string;
    cod_ancert: string;
    actouif: string;
    actosunat: string;
    notary_data: {
        codnotario: string;
        codoficial: string;
        coduif: string;
        nombre_notario: string;
        direccion: string;
        distrito: string;
        provincia: string;
        departamento: string;
    }
}

export interface SisgenResponse {
    error: number;
    data: SisgenDoc[];
    total: number;
    errores: string[];
    observaciones: string[];
    personas: string[];
} 

export interface SisgenRequest {
    all: number;
    documents: {
        kardex: string;
        idkardex: string;
    }[];
}

export default new SisgenClient<SisgenResponse, SisgenRequest>('/send-sisgen/');