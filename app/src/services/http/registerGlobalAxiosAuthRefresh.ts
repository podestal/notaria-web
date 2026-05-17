import axios from "axios"
import { attachAxiosAuthRefreshInterceptor } from "./attachAxiosAuthRefreshInterceptor"
import { attachAxiosAuthRequestInterceptor } from "./attachAxiosAuthRequestInterceptor"
import { isAppBackendAbsoluteUrl } from "./tokenRefresh"

const isAppBackend = (config: { url?: string } | undefined) => isAppBackendAbsoluteUrl(config?.url)

attachAxiosAuthRequestInterceptor(axios, isAppBackend)
attachAxiosAuthRefreshInterceptor(axios, isAppBackend)
