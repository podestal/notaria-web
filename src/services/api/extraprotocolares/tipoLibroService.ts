import APIClient from "../apiClient"

export interface TipoLibro {
    idtiplib: number
    coddlib: string
    destiplib: string
}

export default new APIClient<TipoLibro>('/tipolibro/')