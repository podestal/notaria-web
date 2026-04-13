import apiClient from "../apiClient"

export interface SellosCartas {
    idsello: number;
    dessello: string;
    contenido: string;
}

export default new apiClient<SellosCartas>('/sellos-cartas/')
