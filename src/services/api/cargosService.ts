import APIClient from "./apiClient"

export interface Cargo {
    idcargoprofe: number;
    codcargoprofe: string;
    descripcrapro: string;
}

export default new APIClient<Cargo, Cargo>('/cargoprofe/')