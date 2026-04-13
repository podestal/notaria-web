import APIClient from "./apiClient"

export interface Abogado {
    idabogado: string;
    razonsocial: string;
    direccion: string;
    distrito: string | null;
    documento: string;
    telefono: string;
    matricula: string;
    fax: string;
    sede_colegio: string;
}

export default new APIClient<Abogado, Abogado>('/abogados/')