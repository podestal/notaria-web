import APIClient from "./apiClient"

export interface Ubigeo {
    coddis: string;
    nomdis: string;
    nomprov: string;
    nomdpto: string;
    coddist: string;
    codprov: string;
    codpto: string;
}

export default new APIClient<Ubigeo, Ubigeo>('/ubigeos/')