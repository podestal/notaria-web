import axios from "axios"
import { attachAxiosAuthRefreshInterceptor } from "../http/attachAxiosAuthRefreshInterceptor"
import { attachAxiosAuthRequestInterceptor } from "../http/attachAxiosAuthRequestInterceptor"

const URL = import.meta.env.VITE_COMPLIANCE_URL

const complianceAxios = axios.create({
    baseURL: URL,
    withCredentials: true,
})

attachAxiosAuthRequestInterceptor(complianceAxios)
attachAxiosAuthRefreshInterceptor(complianceAxios)

export default complianceAxios
