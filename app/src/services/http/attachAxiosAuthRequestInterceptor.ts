import type { AxiosInstance, InternalAxiosRequestConfig } from "axios"
import axios from "axios"
import useAuthStore from "../../store/useAuthStore"
import {
    isAuthLoginOrRefreshUrl,
    isJwtExpired,
    isSessionOver,
    redirectToLoginAfterAuthFailure,
} from "./tokenRefresh"

export function getStoredAccessToken(): string | null {
    const fromStore = useAuthStore.getState().access_token?.trim()
    if (fromStore) return fromStore
    const fromStorage = localStorage.getItem("access_token")?.trim()
    return fromStorage || null
}

export function authHeaderValue(token: string): string {
    return token.startsWith("JWT ") ? token : `JWT ${token}`
}

export function setAuthorizationHeader(config: InternalAxiosRequestConfig, value: string) {
    const headers = config.headers
    if (headers && typeof (headers as { set?: unknown }).set === "function") {
        ;(headers as { set: (key: string, val: string) => void }).set("Authorization", value)
        return
    }
    config.headers = config.headers ?? {}
    ;(config.headers as Record<string, string>).Authorization = value
}

export type AuthRequestAttachFilter = (config: InternalAxiosRequestConfig) => boolean

/**
 * Attach `Authorization: JWT <access>` from the auth store / localStorage when not already set.
 * @param shouldAttach — if provided, only attach when this returns true (e.g. bare `axios` + full URL).
 */
export function attachAxiosAuthRequestInterceptor(
    instance: AxiosInstance,
    shouldAttach?: AuthRequestAttachFilter
) {
    instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
        if (shouldAttach && !shouldAttach(config)) return config
        if (isAuthLoginOrRefreshUrl(config.url)) return config

        if (isSessionOver()) {
            redirectToLoginAfterAuthFailure()
            throw new axios.CanceledError("Sesión expirada")
        }

        const token = getStoredAccessToken()

        const headers = config.headers as { get?: (key: string) => unknown } | undefined
        const existing =
            (typeof headers?.get === "function" ? headers.get("Authorization") : undefined) ??
            (config.headers as Record<string, string | undefined> | undefined)?.Authorization ??
            (config.headers as Record<string, string | undefined> | undefined)?.authorization
        const existingToken =
            typeof existing === "string"
                ? existing.replace(/^(JWT|Bearer)\s+/i, "").trim()
                : ""
        if (existingToken && !isJwtExpired(existingToken)) return config
        if (!token) return config

        setAuthorizationHeader(config, authHeaderValue(token))
        return config
    })
}
