import AuthClient from "./authClient";

export interface ProtocolarPermission {
    idtipkar: number
    name: string
    allowed: boolean
}

export interface ExtraProtocolarPermission {
    key: string
    name: string
    allowed: boolean
}

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
    protocolar_permissions?: ProtocolarPermission[]
    extraprotocolar_permissions?: ExtraProtocolarPermission[]
}

export const userCanProtocolar = (
    user: User | null | undefined,
    idtipkar: number,
): boolean => {
    if (!user) return true
    if (Number(user.is_superuser) !== 0) return true
    const perms = user.protocolar_permissions
    if (!perms || perms.length === 0) return true
    const found = perms.find((item) => item.idtipkar === idtipkar)
    return found ? found.allowed : true
}

export const userCanExtraprotocolar = (
    user: User | null | undefined,
    extraType: string,
): boolean => {
    if (!user) return true
    if (Number(user.is_superuser) !== 0) return true
    const perms = user.extraprotocolar_permissions
    if (!perms || perms.length === 0) return true
    const found = perms.find((item) => item.key === extraType)
    return found ? found.allowed : true
}

export default new AuthClient<User>('/users/me/');