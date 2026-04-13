import APIClient from "./apiClient"

export interface DetalleMedioDePago {
    detmp: number;
    itemmp: string;
    kardex: string;
    tipacto: string;
    codmepag: number;
    fpago: string;
    idbancos: number;
    importemp: string;
    idmon: string;
    foperacion: string;
    documentos: string;
}

export type CreateUpdateDetalleMedioDePago = Omit<DetalleMedioDePago, 'detmp'>

interface Props {
    medioDePagoId?: number;
    byKardex?: boolean;
    by_patrimonial?: boolean;
}

const getDetalleMedioDePagoService = ({ medioDePagoId, byKardex, by_patrimonial }: Props) => {
    let url = '/detallemediopago/';
    if (medioDePagoId) {
        url += `${medioDePagoId}/`;
    } else if (byKardex) {
        url += 'by_kardex/';
    } else if (by_patrimonial) {
        url += 'by_patrimonial/';
    }
    return new APIClient<DetalleMedioDePago, CreateUpdateDetalleMedioDePago>(url);
}

export default getDetalleMedioDePagoService