import APIClient from "./apiClient";

export interface Document {
    id: number;
    observacion: string;
    fecha: string;
    usuario: number;
    ip: string;
    pc: string;
    tipogeneracion: string;
    kardex: string;
    cliente: number | null;
    tipo_docu: number;
    num_docu: string | null;
    fecha_partest: string | null;
    flag: string;
    hora: string | null;
    estado: number;
    extension: string | null;
    otrotipo: string | null;
}

export type CreateUpdateDocument = Omit<Document, 'id' > 

interface Props {
    byKardex?: boolean
    documentId?: number
}

const getDocumentService = ({ byKardex, documentId }: Props) => {
    let url = '/documentos/';
    if (byKardex) {
        url += 'by_kardex/';
    } else if (documentId) {
        url += `${documentId}/`;
    }
    return new APIClient<Document, CreateUpdateDocument>(url);
}; 

export default getDocumentService;