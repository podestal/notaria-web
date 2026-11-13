import type { User } from "../services/auth/userService"

/** Staff or Django superuser — ops modules (SISGEN, PDT, UIF, Configuración). */
export const userIsStaffOrSuperuser = (user?: User | null): boolean =>
    Number(user?.is_superuser) !== 0 || Number(user?.is_staff) !== 0
