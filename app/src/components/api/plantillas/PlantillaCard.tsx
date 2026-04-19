import { useState } from "react"
import { Download, FileText, Loader2 } from "lucide-react"
import type { Template } from "../../../services/api/templatesService"
import { downloadTemplateDocument } from "../../../services/api/templateDocumentDownload"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"

interface Props {
    template: Template
}

const PlantillaCard = ({ template }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const [downloading, setDownloading] = useState(false)

    const handleDownload = async () => {
        if (!access) {
            setMessage("No hay sesión activa")
            setShow(true)
            setType("error")
            return
        }
        setDownloading(true)
        try {
            await downloadTemplateDocument(access, template.pktemplate, template.filename)
        } catch (e) {
            const msg = e instanceof Error ? e.message : "No se pudo descargar la plantilla"
            setMessage(msg)
            setShow(true)
            setType("error")
        } finally {
            setDownloading(false)
        }
    }

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <FileText className="h-5 w-5 shrink-0 text-blue-600" aria-hidden />
                <span className="truncate text-sm font-medium text-slate-800" title={template.nametemplate}>
                    {template.nametemplate || "Sin nombre"}
                </span>
            </div>
            <button
                type="button"
                disabled={downloading}
                onClick={handleDownload}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                    downloading
                        ? "cursor-wait border-slate-200 bg-slate-100 text-slate-500"
                        : "border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
                {downloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                    <Download className="h-4 w-4" aria-hidden />
                )}
                {downloading ? "Descargando…" : "Descargar"}
            </button>
        </div>
    )
}

export default PlantillaCard
