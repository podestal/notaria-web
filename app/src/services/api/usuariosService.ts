import APIClient from "./apiClient"

export interface Usuario {
    idusuario: number
    username: string
    first_name: string
    last_name: string
    email: string
}

export type UsuarioDisplayFields = Pick<Usuario, "idusuario" | "username" | "first_name" | "last_name">

export function getUsuarioDisplayName(u: UsuarioDisplayFields): string {
    const full = `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim()
    return full || u.username || String(u.idusuario)
}

export default new APIClient<Usuario, Usuario>("/users/")
