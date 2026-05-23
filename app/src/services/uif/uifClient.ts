import axios from "axios"
import { attachAxiosAuthRefreshInterceptor } from "../http/attachAxiosAuthRefreshInterceptor"
import { attachAxiosAuthRequestInterceptor } from "../http/attachAxiosAuthRequestInterceptor"

const URL = import.meta.env.VITE_UIF_URL

const uifAxios = axios.create({
    baseURL: URL,
    withCredentials: true,
})

attachAxiosAuthRequestInterceptor(uifAxios)
attachAxiosAuthRefreshInterceptor(uifAxios)

export default uifAxios
