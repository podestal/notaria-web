import { useState } from "react"
import { motion } from "framer-motion"
import { Download, FileText, Loader2, Trash2 } from "lucide-react"
import type { Template } from "../../../services/api/templatesService"
import { downloadTemplateDocument } from "../../../services/api/templateDocumentDownload"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useDeleteTemplate from "../../../hooks/api/templates/useDeleteTemplate"
import TopModal from "../../ui/TopModal"
import { EXTRA_ID_BADGE_CLASS } from "../extraprotocolares/ExtraTableShell"
import { rowMotionProps } from "../extraprotocolares/rowMotion"

interface Props {
    template: Template
    hideDelete?: boolean
    index?: number
}

const PlantillaCard = ({ template, hideDelete = false, index = 0 }: Props) => {
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
        <>
            <motion.div
                {...rowMotionProps(index)}
                className="group flex flex-wrap items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-sky-50/70"
            >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-100 transition group-hover:bg-sky-100">
                        <FileText className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                        <p
                            className="truncate text-sm font-semibold text-slate-800"
                            title={template.nametemplate}
                        >
                            {template.nametemplate || "Sin nombre"}
                        </p>
                        <span className={`${EXTRA_ID_BADGE_CLASS} mt-1`}>#{template.pktemplate}</span>
                    </div>
                </div>
                <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
                    {!hideDelete && (
                        <button
                            type="button"
                            disabled={deleteTemplate.isPending}
                            onClick={() => setOpenDeleteModal(true)}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-60"
                        >
                            {deleteTemplate.isPending ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                            ) : (
                                <Trash2 className="h-3.5 w-3.5" aria-hidden />
                            )}
                            Eliminar
                        </button>
                    )}
                    <motion.button
                        type="button"
                        disabled={downloading}
                        onClick={handleDownload}
                        whileHover={downloading ? undefined : { y: -1 }}
                        whileTap={downloading ? undefined : { scale: 0.96 }}
                        className="inline-flex items-center gap-1 rounded-md border border-blue-700 bg-blue-600 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
                    >
                        {downloading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                        ) : (
                            <Download className="h-3.5 w-3.5" aria-hidden />
                        )}
                        {downloading ? "Descargando…" : "Descargar"}
                    </motion.button>
                </div>
            </motion.div>

            {!hideDelete && (
                <TopModal isOpen={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <header className="border-b border-rose-100 bg-rose-50/80 px-4 py-3">
                            <h3 className="text-sm font-semibold text-rose-900">Eliminar plantilla</h3>
                            <p className="mt-0.5 text-xs text-rose-700/80">Esta acción no se puede deshacer</p>
                        </header>
                        <div className="p-4">
                            <p className="text-sm text-slate-700">
                                ¿Eliminar{" "}
                                <span className="font-semibold text-slate-900">
                                    {template.nametemplate || "Sin nombre"}
                                </span>
                                ?
                            </p>
                            <div className="mt-4 flex flex-wrap justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setOpenDeleteModal(false)}
                                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleteTemplate.isPending}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-rose-700 bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-55"
                                >
                                    {deleteTemplate.isPending ? (
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                                    ) : (
                                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                                    )}
                                    {deleteTemplate.isPending ? "Eliminando…" : "Eliminar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </TopModal>
            )}
        </>
    )
}

export default PlantillaCard
