import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { getMapUsersServiceSingle } from "../../../services/api/users/mapUsersService"
import type { User } from "../../../services/auth/userService"

interface Props {
    access: string
    idusuario: number
    enabled?: boolean
}

const useGetMapUserById = ({
    access,
    idusuario,
    enabled = true,
}: Props): UseQueryResult<User, Error> => {
    const service = getMapUsersServiceSingle({ idusuario })

    return useQuery({
        queryKey: ["admin-users", idusuario],
        queryFn: () => service.get(access),
        enabled: enabled && !!access && idusuario > 0,
    })
}

export default useGetMapUserById
