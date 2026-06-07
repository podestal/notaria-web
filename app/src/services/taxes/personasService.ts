import TaxesClient from "./taxesCliente"

export interface Persona {
    id_persona: number
    nombres: string | null
    apellido_paterno: string | null
    apellido_materno: string | null
    razon_social: string | null
    nombre_comercial: string | null
    documento: number
    numero_documento: string
    direccion: string | null
    fecha_nacimiento: string | null
    nombre_completo: string
    email: string | null
    creado: string | null
    actualizado: string | null
}

export interface PersonasPage {
    count: number
    next: string | null
    previous: string | null
    results: Persona[]
}

export const getPersonasServiceSingle = (id_persona?: number) =>
    new TaxesClient<Persona>(id_persona ? `/personas/${id_persona}/` : "/personas/")

export const personasService = new TaxesClient<PersonasPage>("/personas/")

export default personasService
