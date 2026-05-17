import axios, { type AxiosInstance } from "axios"
import { attachAxiosAuthRefreshInterceptor } from "../http/attachAxiosAuthRefreshInterceptor"
import { attachAxiosAuthRequestInterceptor } from "../http/attachAxiosAuthRequestInterceptor"

const rawBase = (import.meta.env.VITE_API_URL as string | undefined) ?? ""
const baseURL = rawBase.replace(/\/$/, "")

/**
 * Axios instance for template file downloads (same origin / credentials as the main API).
 */
export const templateFileAxios: AxiosInstance = axios.create({
    baseURL: baseURL || undefined,
    withCredentials: true,
})

attachAxiosAuthRequestInterceptor(templateFileAxios)
attachAxiosAuthRefreshInterceptor(templateFileAxios)

const parseFilenameFromContentDisposition = (header: string | undefined): string | null => {
    if (!header) return null
    const utf8 = /filename\*=UTF-8''([^;\s]+)/i.exec(header)
    if (utf8?.[1]) {
        try {
            return decodeURIComponent(utf8[1].replace(/(^")|("$)/g, ""))
        } catch {
            return utf8[1]
        }
    }
    const quoted = /filename="([^"]+)"/i.exec(header)
    if (quoted?.[1]) return quoted[1]
    const plain = /filename=([^;\s]+)/i.exec(header)
    if (plain?.[1]) return plain[1].replace(/^["']|["']$/g, "")
    return null
}

/**
 * GET `templates/{templateId}/file/` with JWT, then triggers a browser download of the blob.
 */
export const downloadTemplateDocument = async (
    access: string,
    templateId: number,
    suggestedFilename?: string
): Promise<void> => {
    const response = await templateFileAxios.get<Blob>(`/templates/${templateId}/file/`, {
        headers: { Authorization: `JWT ${access}` },
        responseType: "blob",
    })

    const blob =
        response.data instanceof Blob
            ? response.data
            : new Blob([response.data as unknown as BlobPart], {
                  type: response.headers["content-type"] ?? "application/octet-stream",
              })

    const fromHeader = parseFilenameFromContentDisposition(response.headers["content-disposition"])
    const filename = (suggestedFilename?.trim() || fromHeader || `plantilla-${templateId}`).replace(
        /[/\\?%*:|"<>]/g,
        "-"
    )

    const objectUrl = window.URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = objectUrl
    anchor.download = filename
    anchor.rel = "noopener"
    anchor.style.display = "none"
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.URL.revokeObjectURL(objectUrl)
}
