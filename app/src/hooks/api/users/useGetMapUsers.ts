import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import mapUsersService from "../../../services/api/users/mapUsersService"
import type { User } from "../../../services/auth/userService"

interface Props {
    access: string
    enabled?: boolean
}

const useGetMapUsers = ({
    access,
    enabled = true,
}: Props): UseQueryResult<User[], Error> => {
    return useQuery({
        queryKey: ["admin-users"],
        queryFn: () => mapUsersService.get(access),
        enabled: enabled && !!access,
    })
}

export default useGetMapUsers
