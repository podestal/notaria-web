import { useEffect, useRef, useState } from "react"
import { Loader } from "lucide-react"
import TopModal from "../../ui/TopModal"
import useSisgenSendDocuments from "../../../hooks/sisgen/useSisgenSendDocuments"
import useSisgenSendPreview from "../../../hooks/sisgen/useSisgenSendPreview"
import useSisgenSendJob from "../../../hooks/sisgen/useSisgenSendJob"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import type { SisgenSendResult } from "../../../services/sisgen/sisgenSendJobService"
import type { SisgenSearchFilters } from "../../../utils/buildSisgenSearchFilters"
import {
    summarizeSisgenSendErrors,
} from "../../../utils/sisgenSubmissionErrors"
import {
    hasSisgenJobDocumentSummary,
    summarizeSisgenJobDocuments,
} from "../../../utils/sisgenJobSummary"
import SisgenJobDocumentsTable from "./SisgenJobDocumentsTable"
import SisgenJobSummaryCards from "./SisgenJobSummaryCards"
import getTitleCase from "../../../utils/getTitleCase"

const ESTADO_LABELS: Record<number, string> = {
    [-1]: "Todos los documentos",
    0: "No enviado",
    1: "Enviado",
    2: "Enviado observado",
    3: "No enviado fallido",
    4: "Sin código ANCERT",
    5: "Todos los documentos",
}

const TIPO_INSTRUMENTO_LABELS: Record<number, string> = {
    1: "Escrituras",
    2: "No contenciosos",
    3: "Transferencias vehiculares",
    4: "Garantías inmobiliarias",
    5: "Libros",
}

interface Props {
    isOpen: boolean
    onClose: () => void
    access: string
    filters: SisgenSearchFilters | null
    onSent?: () => void
}

const SisgenSendAllPreviewModal = ({
    isOpen,
    onClose,
    access,
    filters,
    onSent,
}: Props) => {
    const preview = useSisgenSendPreview()
    const send = useSisgenSendDocuments()
    const { setMessage, setShow, setType } = useNotificationsStore()
    const [confirmSend, setConfirmSend] = useState(false)
    const [jobId, setJobId] = useState<number | null>(null)
    const [sendResult, setSendResult] = useState<SisgenSendResult | null>(null)
    const [jobFailedMessage, setJobFailedMessage] = useState<string | null>(null)
    const jobNotifiedRef = useRef(false)

    const job = useSisgenSendJob({
        jobId,
        access,
        enabled: isOpen && jobId != null,
    })

    useEffect(() => {
        if (!isOpen) {
            preview.reset()
            send.reset()
            setConfirmSend(false)
            setJobId(null)
            setSendResult(null)
            setJobFailedMessage(null)
            jobNotifiedRef.current = false
            return
        }
        if (!filters || !access) return
        preview.mutate({ access, filters })
    }, [isOpen, filters, access])

    useEffect(() => {
        if (!job.data || jobNotifiedRef.current) return

        if (job.data.status === "completed" && job.data.result) {
            jobNotifiedRef.current = true
            setSendResult(job.data.result)

            const docSummary = summarizeSisgenJobDocuments(job.data.documents ?? [])
            const guardados = hasSisgenJobDocumentSummary(docSummary)
                ? docSummary.completados
                : (job.data.result.guardados ?? 0)
            const fallidos = hasSisgenJobDocumentSummary(docSummary)
                ? docSummary.fallidos
                : (job.data.result.fallidos ?? 0)
            const observados = job.data.result.observados ?? 0
            const desc = job.data.result.messageDescription?.trim()

            let toast = `Envío completado: ${guardados} completado(s)`
            if (fallidos > 0) toast += `, ${fallidos} fallido(s)`
            if (observados > 0) toast += `, ${observados} observado(s)`
            if (desc) toast += `. ${desc}`

            setMessage(toast)
            setType(fallidos > 0 && guardados === 0 ? "error" : "success")
            setShow(true)
            onSent?.()
        }

        if (job.data.status === "failed") {
            jobNotifiedRef.current = true
            const msg =
                job.data.failure_message
                || job.data.message
                || "El trabajo de envío falló."
            setJobFailedMessage(msg)
            setMessage(msg)
            setType("error")
            setShow(true)
        }
    }, [job.data, onSent, setMessage, setShow, setType])

    const data = preview.data
    const documents = data?.documents ?? []
    const showList = data?.error === 0 && documents.length > 0
    const isJobActive =
        jobId != null
        && job.data?.status !== "completed"
        && job.data?.status !== "failed"
    const isSending = send.isPending || isJobActive

    const handleClose = () => {
        if (isSending) return
        onClose()
    }

    const handleStartSend = () => {
        if (!showList) return
        setConfirmSend(true)
    }

    const handleConfirmSend = () => {
        if (!access || documents.length === 0 || !filters) return

        send.mutate(
            {
                access,
                body: {
                    ...filters,
                    documents: documents.map((doc) => ({
                        kardex: doc.kardex,
                        idkardex: String(doc.idkardex),
                    })),
                },
            },
            {
                onSuccess: (response) => {
                    setConfirmSend(false)
                    if (response.error !== 0) {
                        setMessage(
                            response.message || "Error al encolar el envío a SISGEN.",
                        )
                        setType("error")
                        setShow(true)
                        return
                    }
                    setJobId(response.job_id)
                },
                onError: (error) => {
                    setConfirmSend(false)
                    setMessage(error.message || "Error al enviar documentos a SISGEN.")
                    setType("error")
                    setShow(true)
                },
            },
        )
    }

    const jobDocuments = job.data?.documents ?? []
    const jobSummary = summarizeSisgenJobDocuments(jobDocuments)
    const useDocumentSummary = hasSisgenJobDocumentSummary(jobSummary)
    const reportedErrors = summarizeSisgenSendErrors(
        jobDocuments,
        sendResult?.errores_sisgen_usuario,
    )

    return (
        <TopModal isOpen={isOpen} onClose={handleClose} wide portal>
            <div className="flex min-h-0 flex-1 flex-col">
                <header className="mb-4 border-b border-slate-200 pb-3">
                    <h3 className="text-lg font-semibold text-slate-900">
                        {sendResult
                            ? "Resultado del envío SISGEN"
                            : isJobActive
                              ? "Enviando a SISGEN"
                              : jobFailedMessage
                                ? "Error en el envío SISGEN"
                                : "Vista previa — Enviar a SISGEN"}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                        {sendResult
                            ? "Resumen del proceso de envío masivo."
                            : isJobActive
                              ? "El envío se procesa en segundo plano. Puede cerrar esta ventana cuando termine."
                              : jobFailedMessage
                                ? "El trabajo no pudo completarse."
                                : "Revise los documentos y confirme el envío."}
                    </p>
                </header>

                {isJobActive && job.data && (
                    <div className="mb-4 flex min-h-0 flex-1 flex-col gap-3">
                        <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                            <Loader className="h-5 w-5 shrink-0 animate-spin text-blue-600" />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-blue-900">
                                    Procesando envío
                                    {job.data.progress ? ` (${job.data.progress})` : ""}
                                </p>
                                <p className="text-xs text-blue-700">
                                    Estado: {job.data.status}
                                    {job.data.progress_total != null && (
                                        <span className="ml-2">
                                            {job.data.progress_processed ?? 0} de{" "}
                                            {job.data.progress_total}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>

                        {useDocumentSummary && (
                            <SisgenJobSummaryCards summary={jobSummary} compact />
                        )}

                        <SisgenJobDocumentsTable
                            documents={jobDocuments}
                            maxHeightClass="max-h-[55vh]"
                            showAttempt
                        />
                    </div>
                )}

                {jobFailedMessage && !sendResult && (
                    <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {jobFailedMessage}
                    </p>
                )}

                {sendResult && (
                    <div className="mb-4 space-y-3">
                        {useDocumentSummary ? (
                            <SisgenJobSummaryCards summary={jobSummary} />
                        ) : (
                            <div className="grid grid-cols-3 gap-3 rounded-lg bg-slate-50 p-3 text-xs">
                                <div className="text-center">
                                    <p className="font-semibold text-green-700">Guardados</p>
                                    <p className="mt-1 text-lg font-bold text-green-800">
                                        {sendResult.guardados ?? 0}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-amber-700">Observados</p>
                                    <p className="mt-1 text-lg font-bold text-amber-800">
                                        {sendResult.observados ?? 0}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-red-700">Fallidos</p>
                                    <p className="mt-1 text-lg font-bold text-red-800">
                                        {sendResult.fallidos ?? 0}
                                    </p>
                                </div>
                            </div>
                        )}

                        {sendResult.batch_summary && (
                            <details className="rounded-lg border border-slate-200 bg-white p-3 text-xs">
                                <summary className="cursor-pointer font-semibold text-slate-600">
                                    Detalle técnico de lotes SOAP
                                </summary>
                                <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                                    <p>
                                        <span className="text-slate-500">Esperados: </span>
                                        {sendResult.batch_summary.expected_batches}
                                    </p>
                                    <p>
                                        <span className="text-slate-500">Completados: </span>
                                        {sendResult.batch_summary.completed}
                                    </p>
                                    <p>
                                        <span className="text-slate-500">SOAP rechazados: </span>
                                        {sendResult.batch_summary.soap_rejected}
                                    </p>
                                    <p>
                                        <span className="text-slate-500">Fan-out: </span>
                                        {sendResult.batch_summary.fan_out}
                                    </p>
                                </div>
                            </details>
                        )}

                        {sendResult.messageDescription?.trim() && (
                            <p className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                                {sendResult.messageDescription}
                            </p>
                        )}

                        {reportedErrors.length > 0 && (
                            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                <p className="mb-2 text-xs font-semibold text-red-800">
                                    Kardex con error
                                    <span className="ml-1.5 font-normal text-red-600">
                                        ({reportedErrors.length})
                                    </span>
                                </p>
                                <ul className="max-h-32 space-y-2 overflow-y-auto text-xs text-red-700">
                                    {reportedErrors.map((err) => (
                                        <li key={err.kardex || err.message}>
                                            {err.kardex && (
                                                <span className="font-mono font-semibold text-red-800">
                                                    {err.kardex}
                                                    {": "}
                                                </span>
                                            )}
                                            <span>{err.message}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {!useDocumentSummary &&
                            sendResult.processed_kardex &&
                            sendResult.processed_kardex.length > 0 && (
                            <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-3">
                                <p className="text-xs font-semibold text-blue-900">
                                    Kardex procesados
                                    <span className="ml-1.5 font-normal text-blue-600">
                                        ({sendResult.processed_kardex.length})
                                    </span>
                                </p>
                                <ul className="mt-2 flex max-h-36 flex-wrap gap-1.5 overflow-y-auto">
                                    {sendResult.processed_kardex.map((kardex) => (
                                        <li key={kardex}>
                                            <span className="inline-flex items-center rounded-full bg-blue-600 px-2.5 py-1 font-mono text-[11px] font-semibold text-white shadow-sm">
                                                {kardex}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {jobDocuments.length > 0 && (
                            <SisgenJobDocumentsTable
                                documents={jobDocuments}
                                title="Detalle por kardex"
                                maxHeightClass="max-h-[55vh]"
                            />
                        )}
                    </div>
                )}

                {!sendResult && !isJobActive && !jobFailedMessage && preview.isPending && (
                    <div className="flex flex-1 items-center justify-center gap-2 py-16 text-sm text-slate-500">
                        <Loader className="h-5 w-5 animate-spin" aria-hidden />
                        Cargando vista previa...
                    </div>
                )}

                {!sendResult && !isJobActive && !jobFailedMessage && preview.isError && (
                    <div className="space-y-2">
                        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                            {preview.error.message || "No se pudo cargar la vista previa."}
                        </p>
                        {filters && access && (
                            <button
                                type="button"
                                onClick={() => preview.mutate({ access, filters })}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                            >
                                Reintentar
                            </button>
                        )}
                    </div>
                )}

                {!sendResult && !isJobActive && !jobFailedMessage && data && data.error !== 0 && (
                    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {data.message || "Error al obtener la vista previa."}
                    </p>
                )}

                {!sendResult && !isJobActive && !jobFailedMessage && data?.error === 0 && (
                    <>
                        <div className="mb-4 grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3 text-xs sm:grid-cols-3">
                            <div>
                                <p className="font-semibold text-slate-500">Total</p>
                                <p className="mt-0.5 text-base font-semibold text-slate-900">
                                    {data.total}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-500">Desde / Hasta</p>
                                <p className="mt-0.5 text-slate-800">
                                    {data.filters.fechaDesde} — {data.filters.fechaHasta}
                                </p>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-500">Estado</p>
                                <p className="mt-0.5 text-slate-800">
                                    {ESTADO_LABELS[data.filters.estado] ?? data.filters.estado}
                                </p>
                            </div>
                            <div className="col-span-2 sm:col-span-3">
                                <p className="font-semibold text-slate-500">
                                    Tipo de instrumento
                                </p>
                                <p className="mt-0.5 text-slate-800">
                                    {TIPO_INSTRUMENTO_LABELS[data.filters.tipoInstrumento]
                                        ?? data.filters.tipoInstrumento}
                                </p>
                            </div>
                        </div>

                        {confirmSend && (
                            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                                <p className="font-semibold">
                                    ¿Enviar {documents.length} documento(s) a SISGEN?
                                </p>
                                <p className="mt-1 text-xs text-amber-800">
                                    Se encolará un trabajo en segundo plano. Podrá seguir el
                                    progreso en esta ventana.
                                </p>
                            </div>
                        )}

                        {!showList ? (
                            <p className="py-8 text-center text-sm text-slate-500">
                                No hay documentos para enviar con estos filtros.
                            </p>
                        ) : (
                            <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-slate-200">
                                <div className="grid grid-cols-12 gap-2 bg-slate-100 px-3 py-2 text-[10px] font-semibold uppercase text-slate-600">
                                    <p className="col-span-1">Nº</p>
                                    <p className="col-span-3">Kardex</p>
                                    <p className="col-span-8">Acto</p>
                                </div>
                                <ul className="max-h-[50vh] divide-y divide-slate-100 overflow-y-auto">
                                    {documents.map((doc, idx) => (
                                        <li
                                            key={`${doc.idkardex}-${doc.kardex}`}
                                            className="grid grid-cols-12 gap-2 px-3 py-2 text-xs text-slate-800"
                                        >
                                            <p className="col-span-1 text-slate-500">{idx + 1}</p>
                                            <p className="col-span-3 font-mono font-medium">
                                                {doc.kardex}
                                            </p>
                                            <p className="col-span-8 leading-snug">
                                                {getTitleCase(doc.contrato || "")}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                )}

                <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-3">
                    {!sendResult && !isJobActive && confirmSend && (
                        <button
                            type="button"
                            onClick={() => setConfirmSend(false)}
                            disabled={isSending}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                            Cancelar envío
                        </button>
                    )}
                    {!sendResult && !isJobActive && showList && !confirmSend && (
                        <button
                            type="button"
                            onClick={handleStartSend}
                            disabled={preview.isPending || isSending}
                            className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
                        >
                            Enviar
                        </button>
                    )}
                    {!sendResult && !isJobActive && showList && confirmSend && (
                        <button
                            type="button"
                            onClick={handleConfirmSend}
                            disabled={isSending}
                            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
                        >
                            {send.isPending && (
                                <Loader className="h-4 w-4 animate-spin" aria-hidden />
                            )}
                            {send.isPending ? "Encolando..." : "Confirmar envío"}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSending}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </TopModal>
    )
}

export default SisgenSendAllPreviewModal
