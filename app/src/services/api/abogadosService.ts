import APIClient from "./apiClient"

export interface Abogado {
    idabogado: string;
    razonsocial: string | null;
    direccion: string | null;
    distrito: string | null;
    documento: string | null;
    telefono: string | null;
    matricula: string | null;
    fax: string | null;
    sede_colegio: string | null;
}

export interface CreateUpdateAbogado {
    idabogado?: string;
    razonsocial: string | null;
    direccion: string | null;
    distrito: string | null;
    documento: string | null;
    telefono: string | null;
    matricula: string | null;
    fax: string | null;
    sede_colegio: string | null;
}

interface Props {
    idabogado?: string;
}

export const getAbogadosServiceSingle = ({ idabogado }: Props) => {
    const url = idabogado ? `/abogados/${idabogado}/` : "/abogados/";
    return new APIClient<Abogado, CreateUpdateAbogado>(url);
}

const abogadosService = new APIClient<Abogado[], CreateUpdateAbogado>('/abogados/')

export default abogadosService