import APIClient from "./apiClient"

export interface Predio {
    id_predio: number;
    tipo: string;
    tipo_zona: string;
    zona: string;
    denominacion: string;
    tipo_via: string;
    nombre_via: string;
    numero: string;
    manzana: string;
    lote: string;
    kardex: string;
    fecha_registro: string;
}

export type PredioCreateUpdate = Omit<Predio, 'id_predio'>

interface Props {
    predioId?: number;
    byKardex?: boolean;
}

const getPrediosService = ({ predioId, byKardex }: Props) => {
    let endpoint = '/predios/';
    if (predioId) {
        endpoint += `${predioId}/`;
    } else if (byKardex) {
        endpoint += 'by_kardex/';
    }
    return new APIClient<Predio, PredioCreateUpdate>(endpoint);
}

export default getPrediosService;