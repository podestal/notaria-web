import SisgenClient from "./sisgenClient"


export interface SISGENDocument {
    idkardex: number;
    kardex: string;
    numescritura: string;
    fechaescritura: string;
    estado_sisgen: string;
    estado_sisgen_code?: number;
    sisgen_status?: SisgenDocumentStatus;
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
    /** Total SISGEN validation errors for list display (replaces expandable error lists). */
    sisgen_error_count?: number;
    errores?: string[];
    observaciones?: string[];
    personas?: string[];
    descripcionLibro: string;
    descripcionTipoLibro: string;
    domfiscal: string;
    empresa: string;
    estadoSisgen: string;
    fechaIngreso: string;
    id: number;
    idtiplib: number;
    libro: string;
    ruc: string;
    tipoPersona: string;
    uif_validation?: {
        has_errors: boolean;
        errors: { error_type: string; error_description: string }[];
        observations: string[];
    };
    pdt_validation?: {
        has_errors: boolean;
        errors: string[];
    };
    sisgen_last_submission?: SisgenLastSubmission;
  }

export interface SisgenDocumentStatus {
    estado_sisgen_code: number;
    estado_sisgen_label: string;
    status_ui: string;
    needs_resubmit?: boolean;
    submission_stale?: boolean;
    can_send?: boolean;
    last_submission?: SisgenLastSubmission;
}

export interface SisgenLastSubmission {
    exists: boolean;
    created_at?: string;
    batch_index?: number;
    http_status?: number;
    soap_return_status?: string;
    soap_return_message?: string;
    document_status?: string;
    status_ui?: string;
    remote_status_ui?: string;
    errors?: string[];
    has_errors?: boolean;
    can_send?: boolean;
    needs_resubmit?: boolean;
}


export interface Pagination {
    current_page: number;
    has_next: boolean;
    has_previous: boolean;
    page_size: number;
    processed: number;
    search_id: string;
    total_documents: number;
    total_pages: number;
}

export interface SISGENSearchResponse {
    error: number;            
    data: SISGENDocument[];
    total: number;
    errores: string[];
    observaciones: string[];
    personas: any[];          
    message?: string;     
    pagination: Pagination;
}

export interface SISGENSearchRequest {
    fechaDesde: string;        // Format: "YYYY-MM-DD"
    fechaHasta: string;        // Format: "YYYY-MM-DD"
    tipoInstrumento: number;   // 1-5 (Escritura, Certificado, etc.)
    estado: number;            // -1 to 5 (No Enviado, Enviado, etc.)
    codigoActo: number;   
    page: number;
    search_id?: string;
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