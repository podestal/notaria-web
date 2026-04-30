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
}

const PlantillaCard = ({ template }: Props) => {
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
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    disabled={deleteTemplate.isPending}
                    onClick={() => setOpenDeleteModal(true)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                        deleteTemplate.isPending
                            ? "cursor-wait border-slate-200 bg-slate-100 text-slate-500"
                            : "border-rose-600 bg-rose-600 text-white hover:bg-rose-700"
                    }`}
                >
                    {deleteTemplate.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                        <Trash2 className="h-4 w-4" aria-hidden />
                    )}
                    {deleteTemplate.isPending ? "Eliminando..." : "Eliminar"}
                </button>
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
            <TopModal isOpen={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                    <p className="text-sm text-rose-700">
                        Desea eliminar la plantilla{" "}
                        <span className="font-semibold">{template.nametemplate || "Sin nombre"}</span>?
                    </p>
                    <div className="mt-3 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setOpenDeleteModal(false)}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleteTemplate.isPending}
                            className="rounded-lg border border-rose-700 bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {deleteTemplate.isPending ? "Eliminando..." : "Eliminar"}
                        </button>
                    </div>
                </div>
            </TopModal>
        </div>
    )
}

export default PlantillaCard
