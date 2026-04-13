import APIClient from "./apiClient"

export interface Nacionalidad {
    idnacionalidad: number;
    codnacion: string;
    desnacionalidad: string;
    descripcion: string;
}

export default new APIClient<Nacionalidad, Nacionalidad>('/nacionalidades/')