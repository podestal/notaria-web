import type { AxiosInstance, InternalAxiosRequestConfig } from "axios"
import useAuthStore from "../../store/useAuthStore"

export function getStoredAccessToken(): string | null {
    const fromStore = useAuthStore.getState().access_token?.trim()
    if (fromStore) return fromStore
    const fromStorage = localStorage.getItem("access_token")?.trim()
    return fromStorage || null
}

export function authHeaderValue(token: string): string {
    return token.startsWith("JWT ") ? token : `JWT ${token}`
}

function setAuthorizationHeader(config: InternalAxiosRequestConfig, value: string) {
    const headers = config.headers
    if (headers && typeof (headers as { set?: unknown }).set === "function") {
        ;(headers as { set: (key: string, val: string) => void }).set("Authorization", value)
        return
    }
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
    instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        if (shouldAttach && !shouldAttach(config)) return config

        const token = getStoredAccessToken()
        if (!token) return config

        const headers = config.headers as Record<string, string | undefined>
        if (headers?.Authorization || headers?.authorization) return config

        setAuthorizationHeader(config, authHeaderValue(token))
        return config
    })
}
