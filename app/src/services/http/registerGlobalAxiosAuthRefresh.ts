import axios from "axios"
import { attachAxiosAuthRefreshInterceptor } from "./attachAxiosAuthRefreshInterceptor"
import { isAppBackendAbsoluteUrl } from "./tokenRefresh"

attachAxiosAuthRefreshInterceptor(axios, (config) => isAppBackendAbsoluteUrl(config?.url))
