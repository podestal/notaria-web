import axios from "axios"
import { attachAxiosAuthRefreshInterceptor } from "../http/attachAxiosAuthRefreshInterceptor"
import { attachAxiosAuthRequestInterceptor } from "../http/attachAxiosAuthRequestInterceptor"

const taxesHttp = axios.create({
    baseURL: import.meta.env.VITE_TAXES_URL,
    withCredentials: true,
})
attachAxiosAuthRequestInterceptor(taxesHttp)
attachAxiosAuthRefreshInterceptor(taxesHttp)

export default taxesHttp
