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
    tipper: string | null;
    apepat: string | null;
    apemat: string | null;
    prinom: string | null;
    segnom: string | null;
    ruc: string | null;
    domicilio: string | null;
    coddis: string | null;
    empresa: string | null;
    domfiscal: string | null;
    idtiplib: number | null;
    descritiplib: string | null;
    idlegal: number | null;
    folio: string | null;
    idtipfol: number | null;
    detalle: string | null;
    idnotario: number | null;
    solicitante: string | null;
    comentario: string | null;
    feclegal: string | null; // Date as string
    comentario2: string | null;
    dni: string | null;
    idusuario: number | null;
    idnlibro: number | null;
    codclie: string | null;
    flag: number | null;
    numdoc_plantilla: string | null; // Assuming this is a document template ID
    estadosisgen: number | null;
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