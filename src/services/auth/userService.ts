import AuthClient from "./authClient";

// ['idusuario', 'username', 'email', 'notary', 'first_name', 'last_name']

export interface User {
    idusuario: number;
    username: string;
    email: string;
    notary: boolean;
    first_name: string;
    last_name: string;
}

export default new AuthClient<User>('/users/me/');