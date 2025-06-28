import APIClient from "./authClient"

export interface JWT {
    access: string  
    refresh: string 
}

export interface JWTCredentials {
    username: string
    password: string 
}

const loginService = new APIClient<JWT, JWTCredentials>('jwt/create/')

export default loginService