import axios from "axios"
import useAuthStore from "../../store/useAuthStore"
import useUserInfoStore from "../../hooks/store/useGetUserInfo"

const AUTH_BASE = (import.meta.env.VITE_AUTH_URL as string | undefined)?.replace(/\/$/, "") ?? ""

/** Default matches Djoser-style `jwt/refresh/`; override with `VITE_JWT_REFRESH_PATH` if needed (e.g. `token/refresh/`). */
const REFRESH_PATH =
    (import.meta.env.VITE_JWT_REFRESH_PATH as string | undefined)?.replace(/^\//, "") || "jwt/refresh/"

/** Dedicated client so refresh calls never run through auth-refresh interceptors. */
const refreshHttp = axios.create({
    baseURL: AUTH_BASE || undefined,
})

let refreshInFlight: Promise<string> | null = null
let sessionRedirectScheduled = false

export function redirectToLoginAfterAuthFailure() {
    if (sessionRedirectScheduled) return
    sessionRedirectScheduled = true
    useAuthStore.getState().clearTokens()
    useUserInfoStore.getState().setUser(null)
    window.location.replace("/")
}

export function isAuthLoginOrRefreshUrl(url: string | undefined): boolean {
    if (!url) return false
    const u = url.toLowerCase()
    return u.includes("jwt/create") || u.includes("jwt/refresh") || u.includes("token/refresh")
}

async function fetchNewAccessToken(): Promise<string> {
    const refresh =
        useAuthStore.getState().refresh_token?.trim() ||
        localStorage.getItem("refresh_token")?.trim() ||
        ""

    if (!refresh) {
        redirectToLoginAfterAuthFailure()
        throw new Error("No refresh token")
    }

    const { data } = await refreshHttp.post<{ access: string; refresh?: string }>(REFRESH_PATH, {
        refresh,
    })

    const access = data.access
    const nextRefresh = data.refresh ?? refresh
    useAuthStore.getState().setTokens(access, nextRefresh)
    return access
}

/** One refresh at a time; parallel 401s share the same promise. */
export function getRefreshedAccessToken(): Promise<string> {
    if (!refreshInFlight) {
        refreshInFlight = fetchNewAccessToken().finally(() => {
            refreshInFlight = null
        })
    }
    return refreshInFlight
}

const normalizeBase = (b: string | undefined) => (b ?? "").replace(/\/$/, "")

/** Default `axios` with a full URL to one of our backends. */
export function isAppBackendAbsoluteUrl(url: string | undefined): boolean {
    if (!url || !url.startsWith("http")) return false
    const bases = [
        normalizeBase(import.meta.env.VITE_API_URL),
        normalizeBase(import.meta.env.VITE_DOC_URL),
        normalizeBase(import.meta.env.VITE_SIGNATUM_URL),
        normalizeBase(import.meta.env.VITE_SISGEN_URL),
        normalizeBase(import.meta.env.VITE_UIF_URL),
        normalizeBase(import.meta.env.VITE_AUTH_URL),
    ].filter(Boolean)
    return bases.some((base) => url.startsWith(base))
}
