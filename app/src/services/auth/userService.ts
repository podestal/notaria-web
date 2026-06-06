import AuthClient from "./authClient";

export interface User {
    idusuario: number
    username: string
    email: string
    first_name: string
    last_name: string
    notary: number
    taxes_usuario_id: number | null
    negocio_id: number | null
    is_active: boolean
    is_staff: boolean
    is_superuser: boolean
    date_joined: string
    last_login: string | null
}

export default new AuthClient<User>('/users/me/');