import APIClient from "./apiClient"

export interface Profesion {
    idprofesion: number;
    codprof: string;
    desprofesion: string;
}

export default new APIClient<Profesion, Profesion>('/profesiones/')