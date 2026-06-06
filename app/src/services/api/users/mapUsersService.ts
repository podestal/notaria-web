import APIClient from "../apiClient"
import type { User } from "../../auth/userService"

export interface UpdateMapUser {
    username?: string
    email?: string
    first_name?: string
    last_name?: string
    notary?: number
    taxes_usuario_id?: number | null
    negocio_id?: number | null
    is_active?: boolean
    is_staff?: boolean
    is_superuser?: boolean
}

interface Props {
    idusuario?: number
}

export const getMapUsersServiceSingle = ({ idusuario }: Props = {}) => {
    const url =
        idusuario != null ? `/admin/users/${idusuario}/` : "/admin/users/"
    return new APIClient<User, UpdateMapUser>(url)
}

const mapUsersService = new APIClient<User[], UpdateMapUser>("/admin/users/")

export default mapUsersService
