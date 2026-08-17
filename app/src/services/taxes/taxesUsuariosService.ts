import TaxesClient from "./taxesCliente"

export interface TaxesUsuario {
    id_usuario: number
    usuario: string
    email: string
    telefono: string
    estado: number
    negocio_id: number | null
    rol_id: number | null
    persona_id: number | null
}

export interface CreateTaxesUsuarioPersona {
    nombres: string
    apellido_paterno: string
    apellido_materno?: string
    numero_documento: string
}

export interface CreateTaxesUsuarioPayload {
    usuario: string
    negocio_id: number
    idusuario?: number
    persona: CreateTaxesUsuarioPersona
}

export const taxesUsuariosService = new TaxesClient<TaxesUsuario[]>("/usuarios/")

export const taxesUsuariosCreateService = new TaxesClient<
    TaxesUsuario,
    CreateTaxesUsuarioPayload
>("/usuarios/")
