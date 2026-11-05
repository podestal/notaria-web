import axios from "axios"
import { jwtDecode } from "jwt-decode"
import useAuthStore from "../../store/useAuthStore"
import useUserInfoStore from "../../hooks/store/useGetUserInfo"
import { queryClient } from "../../queryClient"

const SESSION_NOTICE_KEY = "auth_session_notice"
export const SESSION_EXPIRED_MESSAGE = "Su sesión expiró. Inicie sesión de nuevo."

interface JwtPayload {
    exp?: number
}

export function jwtExpSeconds(token: string | null | undefined): number | null {
    if (!token) return null
    try {
        const exp = jwtDecode<JwtPayload>(token).exp
        return typeof exp === "number" ? exp : null
    } catch {
        return null
    }
}

export function isJwtExpired(token: string | null | undefined, skewSeconds = 15): boolean {
    const exp = jwtExpSeconds(token)
    if (!exp) return true
    return Date.now() / 1000 >= exp - skewSeconds
}

function storedRefreshToken(): string {
    return (
        useAuthStore.getState().refresh_token?.trim() ||
        localStorage.getItem("refresh_token")?.trim() ||
        ""
    )
}

function storedAccessToken(): string {
    return (
        useAuthStore.getState().access_token?.trim() ||
        localStorage.getItem("access_token")?.trim() ||
        ""
    )
}

/**
 * Session ends when the access token expires (12h from login).
 * Do not mint a new access token past that — next day they sign in again.
 */
export function isSessionOver(): boolean {
    const refresh = storedRefreshToken()
    const access = storedAccessToken()
    if (!refresh && !access) return false
    if (!access) return true
    return isJwtExpired(access, 0)
}

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
    if (window.location.pathname === "/" || window.location.pathname === "") return
    sessionRedirectScheduled = true
    try {
        sessionStorage.setItem(SESSION_NOTICE_KEY, SESSION_EXPIRED_MESSAGE)
    } catch {
        /* ignore private mode */
    }
    useAuthStore.getState().clearTokens()
    useUserInfoStore.getState().setUser(null)
    queryClient.clear()
    window.location.replace("/")
}

export function consumeSessionNotice(): string | null {
    try {
        const notice = sessionStorage.getItem(SESSION_NOTICE_KEY)
        if (notice) sessionStorage.removeItem(SESSION_NOTICE_KEY)
        return notice
    } catch {
        return null
    }
}

/** Kick the user to login when the 12h session is over, even if the tab was left open. */
export function startSessionExpiryWatch() {
    const check = () => {
        if (isSessionOver()) redirectToLoginAfterAuthFailure()
    }
    check()
    const timer = window.setInterval(check, 30_000)
    const onVisible = () => {
        if (document.visibilityState === "visible") check()
    }
    document.addEventListener("visibilitychange", onVisible)
    window.addEventListener("focus", check)
    return () => {
        window.clearInterval(timer)
        document.removeEventListener("visibilitychange", onVisible)
        window.removeEventListener("focus", check)
    }
}

export function isAuthLoginOrRefreshUrl(url: string | undefined): boolean {
    if (!url) return false
    const u = url.toLowerCase()
    return u.includes("jwt/create") || u.includes("jwt/refresh") || u.includes("token/refresh")
}

async function fetchNewAccessToken(): Promise<string> {
    const refresh = storedRefreshToken()

    if (!refresh || isJwtExpired(refresh, 0)) {
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
        normalizeBase(import.meta.env.VITE_COMPLIANCE_URL),
        normalizeBase(import.meta.env.VITE_AUTH_URL),
    ].filter(Boolean)
    return bases.some((base) => url.startsWith(base))
}
