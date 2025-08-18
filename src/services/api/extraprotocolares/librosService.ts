import APIClient from "../apiClient"

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
}

export const getLibrosServiceSingle = ({ libroId }: Props) => {
    let url = '/libros/';
    if (libroId) {
        url += `${libroId}/`;
    }
    return new APIClient<Libro, CreateUpdateLibro>(url);
}

const getLibrosService = () => {
    return new APIClient<LibrosPage, CreateUpdateLibro>('/libros/');
}

export default getLibrosService;