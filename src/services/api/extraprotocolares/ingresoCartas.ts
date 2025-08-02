import APIClient from "../apiClient"

export interface IngresoCartasPage {
    count: number;
    next: string | null;
    previous: string | null;
    results: IngresoCartas[];
}

export interface IngresoCartas {
    id_carta: number;
    num_carta: string;
    fec_ingreso: string; // Date as string
    id_remitente: string;
    nom_remitente: string;
    dir_remitente: string;
    telf_remitente: string;
    nom_destinatario: string;
    dir_destinatario: string;
    zona_destinatario: string;
    costo: string; // String to handle currency
    id_encargado: string;
    des_encargado: string;
    fec_entrega: string; // Date as string
    hora_entrega: string;
    emple_entrega: string;
    conte_carta: string;
    nom_regogio: string;
    doc_recogio: string;
    fec_recogio: string; // Date as string
    fact_recogio: string; // String to handle currency
    dni_destinatario: string; // Optional field
    recepcion: string; // Optional field
    firmo: string;
}

export type CreateUpdateIngresoCartas = Omit<IngresoCartas, 'id_carta' | 'num_carta'>;

interface Props {
    ingresoCartasId?: number;
}

export const getIngresoCartasServiceSingle = ({ ingresoCartasId }: Props) => {
    let url = '/ingreso_cartas/';
    if (ingresoCartasId) {
        url += `${ingresoCartasId}/`;
    }
    return new APIClient<IngresoCartas, CreateUpdateIngresoCartas>(url);
}

const getIngresoCartasService = () => {
    return new APIClient<IngresoCartasPage, CreateUpdateIngresoCartas>('/ingreso_cartas/');
}

export default getIngresoCartasService;