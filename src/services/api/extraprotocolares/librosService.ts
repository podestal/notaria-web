import APIClient from "../apiClient"

export interface LibroPdt {
    bookNumber: string;
    errorItem: string;
    isCorrectable: number;
    typeOfCorrection: string;
    categoryCorrect: string;
    fileType: string;
}

export interface LibroPdtSummary {
    total_kardex: number;
    total_errors: number;
    error_breakdown: Record<string, number>;
}

export interface LibroPdtPage {
    count: number;
    total_pages: number;
    current_page: number;
    page_size: number;
    results: LibroPdt[];
    summary: LibroPdtSummary;
}

export interface LibrosPage {
    count: number;
    next: string | null;
    previous: string | null;
    results: Libro[];
}

export interface Libro {
    id: number;
    numlibro: string;
    ano: string;
    fecing: string; // Date as string
    tipper: string
    apepat: string
    apemat: string
    prinom: string
    segnom: string
    ruc: string
    domicilio: string
    coddis: string
    empresa: string
    domfiscal: string
    idtiplib: number
    descritiplib: string
    idlegal: number
    folio: string
    idtipfol: number
    detalle: string
    idnotario: number
    solicitante: string
    comentario: string
    feclegal: string // Date as string
    comentario2: string
    dni: string
    idusuario: number
    idnlibro: number
    codclie: string
    flag: number
    numdoc_plantilla: string // Assuming this is a document template ID
    estadosisgen: number;
}

export type CreateUpdateLibro = Omit<Libro, 'id'>;

interface Props {
    libroId?: number;
    libroPdt?: boolean;
    byNumlibro?: boolean;
}

export const getLibrosServiceSingle = ({ libroId, libroPdt, byNumlibro }: Props) => {
    let url = '/libros/';
    if (libroId) {
        url += `${libroId}/`;
    } else if (libroPdt) {
        url += 'pdt-errors/';
    } else if (byNumlibro) {
        url += 'by_numlibro/';
    }
    return new APIClient<Libro, CreateUpdateLibro>(url);
}

const getLibrosService = () => {
    return new APIClient<LibrosPage, CreateUpdateLibro>('/libros/');
}

export default getLibrosService;