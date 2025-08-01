import APIClient from "../apiClient"

export interface IngresoCartasPage {
    count: number;
    next: string | null;
    previous: string | null;
    results: IngresoCartas[];
}


            // "id_carta": 509,
            // "num_carta": "2025000023",
            // "fec_ingreso": "03/03/2025",
            // "id_remitente": "",
            // "nom_remitente": "LEILA MARIA JIMENEZ CABRERA",
            // "dir_remitente": "",
            // "telf_remitente": "",
            // "nom_destinatario": "DIAZ PATATINGO WALDIR",
            // "dir_destinatario": "JIRON LAMBAYEQUE N° 417",
            // "zona_destinatario": "211101",
            // "costo": "0.00",
            // "id_encargado": "HUAJARDO JOSE",
            // "des_encargado": "",
            // "fec_entrega": "03/03/2025",
            // "hora_entrega": "15:40 PM",
            // "emple_entrega": "EUDES-UAY",
            // "conte_carta": "Que el original de la presente carta notarial, no ha sido entregada en la dirección indicada por el remitente, porque al ir a la dirección mencionada Jiron Lambayeque NQQ22KK 417, lugar donde funciona una tienda de venta de autopartes de vehículos con un letrero de NIPPONCARS, siendo atendidos por una señora quien no quizo identificarse, y declaro ser la propietaria, negándose a recepcionar la carta, manifestando que no vive, ni conoce a ninguna persona con el nombre del destinatario; La carta notarial consta de ocho (08) fojas, Doy fe. Juliaca tres de marzo del dos mil veinticinco. \t\nSE DEJA CONSTANCIA: que el original de la carta, Se devuelve al interesado.-  \n",
            // "nom_regogio": "",
            // "doc_recogio": "",
            // "fec_recogio": "",
            // "fact_recogio": "",
            // "dni_destinatario": "",
            // "recepcion": "Que el original de la presente carta notarial, no ha sido entregada en la dirección indicada por el remitente, porque al ir a la dirección mencionada Jiron Lambayeque N° 417, lugar donde funciona una tienda de venta de autopartes de vehículos con un ",
            // "firmo": "NO"
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

export type CreateUpdateIngresoCartas = Omit<IngresoCartas, 'id_carta'>;

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