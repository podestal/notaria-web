import axios from "axios"
import { attachAxiosAuthRefreshInterceptor } from "../http/attachAxiosAuthRefreshInterceptor"
import { attachAxiosAuthRequestInterceptor } from "../http/attachAxiosAuthRequestInterceptor"

function resolveDocumentosBaseUrl(): string {
    const explicit = String(import.meta.env.VITE_DOCUMENTOS_URL || "").trim()
    if (explicit) return explicit.endsWith("/") ? explicit : `${explicit}/`

    const base = String(import.meta.env.VITE_BASE_URL || "").trim().replace(/\/$/, "")
    if (base) return `${base}/documentos/`

    const api = String(import.meta.env.VITE_API_URL || "").trim()
    if (api) {
        const root = api.replace(/\/api\/?$/, "")
        if (root) return `${root}/documentos/`
    }

    console.warn(
        "[documentos] VITE_DOCUMENTOS_URL / VITE_BASE_URL missing — requests will fail",
    )
    return "/documentos/"
}

const documentosAxios = axios.create({
    baseURL: resolveDocumentosBaseUrl(),
    withCredentials: true,
})

attachAxiosAuthRequestInterceptor(documentosAxios)
attachAxiosAuthRefreshInterceptor(documentosAxios)

export default documentosAxios
