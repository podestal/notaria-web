import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { AxiosError } from "axios";
import createUserService, {
    CreatedUserResponse,
    CreateUserPayload,
} from "../../services/auth/createUserService";

interface CreateUserData {
    user: CreateUserPayload;
}

const useCreateUser = (): UseMutationResult<CreatedUserResponse, AxiosError, CreateUserData> => {
    return useMutation({
        mutationFn: (data: CreateUserData) => createUserService.post(data.user),
        onError: (err) => {
            console.log(err);
        },
    });
};

export default useCreateUser;
