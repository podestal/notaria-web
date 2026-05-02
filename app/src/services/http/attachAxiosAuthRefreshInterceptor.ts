import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios"
import {
    getRefreshedAccessToken,
    isAuthLoginOrRefreshUrl,
    redirectToLoginAfterAuthFailure,
} from "./tokenRefresh"

type RequestConfig = InternalAxiosRequestConfig & { _authRetry?: boolean }

export type AuthRefresh401Filter = (config: InternalAxiosRequestConfig | undefined) => boolean

function shouldAttemptRefresh(config: RequestConfig | undefined): boolean {
    if (!config || config._authRetry) return false
    if (isAuthLoginOrRefreshUrl(config.url)) return false
    return true
}

/**
 * On 401: refresh JWT once, retry the request; if refresh fails or retry 401s, redirect to `/`.
 * @param filter401 — if set, only run refresh when this returns true (e.g. bare `axios` + full URL).
 */
export function attachAxiosAuthRefreshInterceptor(
    instance: AxiosInstance,
    filter401?: AuthRefresh401Filter
) {
    instance.interceptors.response.use(
        (res) => res,
        async (error: AxiosError) => {
            const status = error.response?.status
            const original = error.config as RequestConfig | undefined

            if (status !== 401 || !original || !shouldAttemptRefresh(original)) {
                return Promise.reject(error)
            }

            if (filter401 && !filter401(original)) {
                return Promise.reject(error)
            }

            try {
                const access = await getRefreshedAccessToken()
                original._authRetry = true
                original.headers = original.headers ?? {}
                original.headers.Authorization = `JWT ${access}`
                return instance.request(original)
            } catch {
                redirectToLoginAfterAuthFailure()
                return Promise.reject(error)
            }
        }
    )
}

