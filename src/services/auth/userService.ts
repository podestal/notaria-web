import AuthClient from "./authClient";

export interface User {
    idusuario: number;
    username: string;
    email: string;
    notary: boolean;
    first_name: string;
    last_name: string;
}

export default new AuthClient<User>('/users/me/');