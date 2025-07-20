import SisgenClient from "./sisgenClient"

export interface SISGENDocument {
    idkardex: number;
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
}

export interface SISGENSearchResponse {
    error: number;            
    data: SISGENDocument[];
    total: number;
    errores: string[];
    observaciones: string[];
    personas: any[];          
    message?: string;          
}

export interface SISGENSearchRequest {
    fechaDesde: string;        // Format: "YYYY-MM-DD"
    fechaHasta: string;        // Format: "YYYY-MM-DD"
    tipoInstrumento: number;   // 1-5 (Escritura, Certificado, etc.)
    estado: number;            // -1 to 5 (No Enviado, Enviado, etc.)
    codigoActo: number;        // 0 for all, or specific act code
}

export const TIPO_INSTRUMENTO = {
    ESCRITURA: 1,
    CERTIFICADO: 2,
    VERIFICACION: 3,
    GESTION: 4,
    TRAMITE: 5
}

export const ESTADO_SISGEN = {
    TODOS: -1,
    NO_ENVIADO: 0,
    ENVIADO: 1,
    ENVIADO_OBSERVADO: 2,
    NO_ENVIADO_FALLIDO: 3,
    SIN_CODIGO_ANCERT: 4,
    TODOS_DOCUMENTOS: 5
}

export default new SisgenClient<SISGENSearchResponse, SISGENSearchRequest>("/search/");