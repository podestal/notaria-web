import AuthClient from "./authClient";

export interface CreateUserPayload {
    username: string;
    email: string;
    password: string;
    notary: boolean | null;
    first_name: string;
    last_name: string;
}

export interface CreatedUserResponse {
    idusuario: number;
    username: string;
    email: string;
    notary: boolean;
    first_name: string;
    last_name: string;
}

const createUserService = new AuthClient<CreatedUserResponse, CreateUserPayload>("/users/");

export default createUserService;
