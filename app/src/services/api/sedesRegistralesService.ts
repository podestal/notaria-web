import APIClient from "./apiClient"

export interface SedeRegistral {
    idsedereg: string;
    dessede: string;
    num_zona?: string;
    zona_depar?: string;
}

export default new APIClient<SedeRegistral>('/sedes_registrales/');