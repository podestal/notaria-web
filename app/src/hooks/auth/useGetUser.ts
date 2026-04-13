import { useQuery, UseQueryResult } from "@tanstack/react-query"
import userService, {User} from "../../services/auth/userService"

interface Props {
    access: string
}

const useGetUser = ({ access }: Props): UseQueryResult<User, Error> => {
    return useQuery({
        queryKey: ['user', access],
        queryFn: () => userService.get(access),
    })
}
export default useGetUser;