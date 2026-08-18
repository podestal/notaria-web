import axios from "axios"
import { attachAxiosAuthRefreshInterceptor } from "../http/attachAxiosAuthRefreshInterceptor"
import { attachAxiosAuthRequestInterceptor } from "../http/attachAxiosAuthRequestInterceptor"

const URL = import.meta.env.VITE_CELERY_URL

const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
})

attachAxiosAuthRequestInterceptor(axiosInstance)
attachAxiosAuthRefreshInterceptor(axiosInstance)

class CeleryClient<ResponseType, RequestType = ResponseType> {
    endpoint: string

    constructor(endpoint: string) {
        this.endpoint = endpoint
    }

    get = (access?: string, params?: Record<string, string>) => {
        const config: Record<string, unknown> = {}
        if (params) {
            config.params = params
        }
        if (access) {
            config.headers = { Authorization: `JWT ${access}` }
        }

        return axiosInstance
            .get<ResponseType>(this.endpoint, config)
            .then((res) => res.data)
    }

    post = (data: RequestType, access?: string, params?: Record<string, string>) => {
        const config: Record<string, unknown> = {}
        if (access) {
            config.headers = { Authorization: `JWT ${access}` }
        }
        if (params) {
            config.params = params
        }

        return axiosInstance
            .post<ResponseType>(this.endpoint, data, config)
            .then((res) => res.data)
    }
}

export default CeleryClient
