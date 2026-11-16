import { useState } from "react"
import axios from "axios"
import { FileText, Loader2 } from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import { getSingleKardexService } from "../../../services/api/kardexService"

interface Props {
    idkardex: number
    kardex: string
}

const SisgenOpenDocumentButton = ({ idkardex, kardex }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const [loading, setLoading] = useState(false)
    const docsURL = import.meta.env.VITE_DOC_URL

    const handleOpen = async () => {
        if (loading) return
        setLoading(true)
        try {
            const kardexService = getSingleKardexService({ id: idkardex })
            const detail = await kardexService.get(access)
            const templateId = Number(detail.fktemplate) || 0

            if (!templateId) {
                setMessage("Este kardex no tiene plantilla asignada.")
                setShow(true)
                setType("error")
                return
            }

            const response = await axios.get(`${docsURL}documentos/open-document/`, {
                responseType: "blob",
                headers: { Authorization: `JWT ${access}` },
                params: {
                    template_id: templateId,
                    kardex: detail.kardex || kardex,
                    mode: "download",
                },
            })

            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            })
            const blobUrl = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = blobUrl
            link.download = `__PROY__${detail.kardex || kardex}.docx`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10_000)
        } catch (error) {
            const status =
                axios.isAxiosError(error) ? error.response?.status : undefined
            if (status === 404) {
                setMessage("El documento aún no ha sido generado para este kardex.")
            } else {
                setMessage("No se pudo abrir el documento.")
            }
            setShow(true)
            setType("error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            type="button"
            onClick={handleOpen}
            disabled={loading}
            title="Abrir documento"
            aria-label={`Abrir documento de ${kardex}`}
            className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-indigo-200 bg-indigo-50 text-indigo-700 transition hover:bg-indigo-100 hover:text-indigo-900 disabled:cursor-wait disabled:opacity-60"
        >
            {loading ? (
                <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
            ) : (
                <FileText className="h-3 w-3" aria-hidden />
            )}
        </button>
    )
}

export default SisgenOpenDocumentButton
