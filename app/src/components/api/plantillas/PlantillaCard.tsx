import { FileText, Download } from "lucide-react"
import type { Template } from "../../../services/api/templatesService"

const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? ""

const resolveDownloadHref = (t: Template): string => {
    const u = t.urltemplate?.trim() ?? ""
    if (!u) return "#"
    if (u.startsWith("http://") || u.startsWith("https://")) return u
    return `${apiBase}${u.startsWith("/") ? "" : "/"}${u}`
}

interface Props {
    template: Template
}

const PlantillaCard = ({ template }: Props) => {
    const href = resolveDownloadHref(template)
    const disabled = !template.urltemplate?.trim()

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <FileText className="h-5 w-5 shrink-0 text-blue-600" aria-hidden />
                <span className="truncate text-sm font-medium text-slate-800" title={template.nametemplate}>
                    {template.nametemplate || "Sin nombre"}
                </span>
            </div>
            <a
                href={disabled ? undefined : href}
                download={template.filename || undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={disabled}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                    disabled
                        ? "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400 pointer-events-none"
                        : "border border-blue-600 bg-blue-600 text-white hover:bg-blue-700"
                }`}
                onClick={(e) => disabled && e.preventDefault()}
            >
                <Download className="h-4 w-4" aria-hidden />
                Descargar
            </a>
        </div>
    )
}

export default PlantillaCard
