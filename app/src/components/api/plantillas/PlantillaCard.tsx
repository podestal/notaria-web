import { useState } from "react"
import { Download, FileText, Loader2, Trash2 } from "lucide-react"
import type { Template } from "../../../services/api/templatesService"
import { downloadTemplateDocument } from "../../../services/api/templateDocumentDownload"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useDeleteTemplate from "../../../hooks/api/templates/useDeleteTemplate"
import TopModal from "../../ui/TopModal"

interface Props {
    template: Template
    /** Oculta eliminar (p. ej. pestaña extraprotocolares). */
    hideDelete?: boolean
}

const PlantillaCard = ({ template, hideDelete = false }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const [downloading, setDownloading] = useState(false)
    const [openDeleteModal, setOpenDeleteModal] = useState(false)
    const deleteTemplate = useDeleteTemplate({ pktemplate: template.pktemplate })

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

    const handleDelete = async () => {
        if (!access) {
            setMessage("No hay sesión activa")
            setShow(true)
            setType("error")
            return
        }

        await deleteTemplate.mutateAsync(
            { access },
            {
                onSuccess: () => {
                    setMessage("Plantilla eliminada correctamente")
                    setShow(true)
                    setType("success")
                    setOpenDeleteModal(false)
                },
                onError: (e) => {
                    const msg = e instanceof Error ? e.message : "No se pudo eliminar la plantilla"
                    setMessage(msg)
                    setShow(true)
                    setType("error")
                },
            }
        )
    }

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <FileText className="h-5 w-5 shrink-0 text-blue-600" aria-hidden />
                <span className="truncate text-sm font-medium text-slate-800" title={template.nametemplate}>
                    {template.nametemplate || "Sin nombre"}
                </span>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:gap-2.5">
                {!hideDelete && (
                    <button
                        type="button"
                        disabled={deleteTemplate.isPending}
                        onClick={() => setOpenDeleteModal(true)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 sm:text-sm ${
                            deleteTemplate.isPending
                                ? "cursor-wait border-slate-200 bg-slate-50 text-slate-400"
                                : "border-slate-200/90 bg-white text-slate-600 shadow-sm hover:border-rose-200 hover:bg-rose-50/90 hover:text-rose-700 focus-visible:ring-rose-400/50 active:scale-[0.98]"
                        }`}
                    >
                        {deleteTemplate.isPending ? (
                            <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                        ) : (
                            <Trash2 className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                        )}
                        {deleteTemplate.isPending ? "Eliminando…" : "Eliminar"}
                    </button>
                )}
                <button
                    type="button"
                    disabled={downloading}
                    onClick={handleDownload}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 sm:text-sm ${
                        downloading
                            ? "cursor-wait bg-slate-100 text-slate-400 shadow-none ring-1 ring-slate-200"
                            : "bg-gradient-to-b from-blue-600 to-blue-700 text-white shadow-blue-600/25 ring-1 ring-blue-500/30 hover:from-blue-500 hover:to-blue-600 hover:shadow-lg hover:shadow-blue-600/35 focus-visible:ring-blue-400 active:scale-[0.98]"
                    }`}
                >
                    {downloading ? (
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
                    ) : (
                        <Download className="h-4 w-4 shrink-0" aria-hidden />
                    )}
                    {downloading ? "Descargando…" : "Descargar"}
                </button>
            </div>
            {!hideDelete && (
                <TopModal isOpen={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                    <div className="rounded-xl border border-rose-100 bg-gradient-to-b from-rose-50 to-white p-5 shadow-sm">
                        <p className="text-sm leading-relaxed text-rose-900/90">
                            ¿Eliminar la plantilla{" "}
                            <span className="font-semibold text-rose-950">{template.nametemplate || "Sin nombre"}</span>
                            ?
                        </p>
                        <div className="mt-5 flex flex-wrap justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setOpenDeleteModal(false)}
                                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleteTemplate.isPending}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-700/90 bg-gradient-to-b from-rose-600 to-rose-700 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-rose-600/20 transition-all hover:from-rose-500 hover:to-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:cursor-not-allowed disabled:opacity-55"
                            >
                                {deleteTemplate.isPending ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                                ) : null}
                                {deleteTemplate.isPending ? "Eliminando…" : "Eliminar"}
                            </button>
                        </div>
                    </div>
                </TopModal>
            )}
        </div>
    )
}

export default PlantillaCard
