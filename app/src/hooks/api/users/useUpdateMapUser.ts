import {
    useMutation,
    useQueryClient,
    type UseMutationResult,
} from "@tanstack/react-query"
import {
    getMapUsersServiceSingle,
    type UpdateMapUser,
} from "../../../services/api/users/mapUsersService"
import type { User } from "../../../services/auth/userService"

export interface UpdateMapUserData {
    access: string
    user: UpdateMapUser
}

interface Props {
    idusuario: number
}

const useUpdateMapUser = ({
    idusuario,
}: Props): UseMutationResult<User, Error, UpdateMapUserData> => {
    const queryClient = useQueryClient()
    const service = getMapUsersServiceSingle({ idusuario })

    return useMutation({
        mutationFn: (data: UpdateMapUserData) =>
            service.update(data.user, data.access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] })
            queryClient.invalidateQueries({
                queryKey: ["admin-users", idusuario],
            })
        },
    })
}

export default useUpdateMapUser
