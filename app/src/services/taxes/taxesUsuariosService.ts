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

export const taxesUsuariosService = new TaxesClient<TaxesUsuario[]>("/usuarios/")
