import { useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import createUserService, {
    CreatedUserResponse,
    CreateUserPayload,
} from "../../services/auth/createUserService";

interface CreateUserData {
    user: CreateUserPayload;
}

const useCreateUser = (): UseMutationResult<CreatedUserResponse, AxiosError, CreateUserData> => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateUserData) => createUserService.post(data.user),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] })
        },
        onError: (err) => {
            console.log(err);
        },
    });
};

export default useCreateUser;
