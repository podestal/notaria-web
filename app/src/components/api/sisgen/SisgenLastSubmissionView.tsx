import { useState } from "react"
import { RotateCw } from "lucide-react"
import useRefreshLastSisgenSearch from "../../../hooks/sisgen/useRefreshLastSisgenSearch"
import type { SisgenLastSubmission } from "../../../services/sisgen/searchSisgenService"
import {
    formatSisgenSubmissionError,
    isSisgenSubmissionErrorObject,
    normalizeSisgenSubmissionErrors,
    type SisgenSubmissionError,
    type SisgenSubmissionErrorObject,
} from "../../../utils/sisgenSubmissionErrors"
import SisgenFieldFix from "./SisgenFieldFix"

interface Props {
    documentLabel: string
    documentValue: string
    submission: SisgenLastSubmission
    /** Enables in-place fixes for the listed campos (kardex documents only). */
    kardex?: string
    onResend?: () => void
    onOpenKardex?: () => void
}

interface FixHandlers {
    kardex: string
    onSaved: () => void
    onResend?: () => void
    onOpenKardex?: () => void
}

const ORIGEN_STYLES: Record<string, { box: string; title: string; label: string }> = {
    dato: {
        box: "border-red-200 bg-red-50 text-red-900",
        title: "text-red-800",
        label: "Corregir en el kardex",
    },
    lote: {
        box: "border-slate-200 bg-slate-50 text-slate-800",
        title: "text-slate-800",
        label: "Bloqueado por otro documento",
    },
    sistema: {
        box: "border-amber-200 bg-amber-50 text-amber-900",
        title: "text-amber-900",
        label: "Error del sistema",
    },
}

const StructuredErrorItem = ({ error, fix }: { error: SisgenSubmissionErrorObject; fix?: FixHandlers }) => {
    const style = ORIGEN_STYLES[error.origen ?? "dato"] ?? ORIGEN_STYLES.dato
    const campos = error.campos ?? []

    return (
        <div className={`space-y-2 rounded-md border px-3 py-3 ${style.box}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
                <p className={`font-semibold ${style.title}`}>{error.titulo}</p>
                <span className="rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide">
                    {style.label}
                </span>
            </div>

            {error.mensaje_usuario && <p className="whitespace-pre-wrap">{error.mensaje_usuario}</p>}

            {campos.length > 0 && (
                <div className="rounded border border-white/80 bg-white/70 px-2 py-2">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Campos a revisar
                    </p>
                    <ul className="space-y-1.5">
                        {campos.map((campo, idx) => (
                            <li key={idx} className="text-sm text-slate-800">
                                <span className="font-medium">
                                    {campo.seccion} › {campo.campo}
                                </span>
                                {campo.referencia && <span className="text-slate-600"> — {campo.referencia}</span>}
                                {campo.valor_actual && (
                                    <span className="mt-0.5 block text-xs text-slate-600">
                                        Valor actual: <span className="font-mono">{campo.valor_actual}</span>
                                    </span>
                                )}
                                {fix && campo.accion && error.origen !== "lote" && (
                                    <SisgenFieldFix
                                        accion={campo.accion}
                                        kardex={error.kardex || fix.kardex}
                                        onSaved={fix.onSaved}
                                        onResend={fix.onResend}
                                        onOpenKardex={fix.onOpenKardex}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {error.que_hacer && (
                <p className="text-sm">
                    <span className="font-semibold">Cómo corregirlo: </span>
                    {error.que_hacer}
                </p>
            )}

            {error.nota_contacto_it && (
                <p className="rounded border border-amber-200 bg-white/70 px-2 py-1.5 text-xs text-amber-900">
                    {error.nota_contacto_it}
                </p>
            )}

            {error.mensaje_tecnico && (
                <details className="text-xs">
                    <summary className="cursor-pointer font-medium opacity-70">Mensaje original de SISGEN</summary>
                    <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded border border-slate-200 bg-white p-2 font-mono text-[11px] text-slate-700">
                        {error.mensaje_tecnico}
                    </pre>
                </details>
            )}
        </div>
    )
}

const SisgenErrorItem = ({ error, fix }: { error: SisgenSubmissionError; fix?: FixHandlers }) => {
    if (isSisgenSubmissionErrorObject(error) && error.titulo) {
        return <StructuredErrorItem error={error} fix={fix} />
    }
    return (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 whitespace-pre-wrap text-red-700">
            {formatSisgenSubmissionError(error)}
        </div>
    )
}

const SisgenLastSubmissionView = ({ documentLabel, documentValue, submission, kardex, onResend, onOpenKardex }: Props) => {
    const [hasFixes, setHasFixes] = useState(false)
    const refreshLastSisgenSearch = useRefreshLastSisgenSearch()
    const fix: FixHandlers | undefined = kardex
        ? {
              kardex,
              onSaved: () => {
                  setHasFixes(true)
                  void refreshLastSisgenSearch()
              },
              onResend,
              onOpenKardex,
          }
        : undefined
    const errors = normalizeSisgenSubmissionErrors(submission.errors)
    const firstObject = errors.find(isSisgenSubmissionErrorObject)
    const documentStatus = submission.document_status || firstObject?.estado || "-"
    const soapStatus = submission.soap_return_status || firstObject?.soap_return_status || "-"
    const hasTechnicalDetail =
        Boolean(submission.soap_return_message) || submission.http_status != null || submission.batch_index != null

    return (
        <div className="space-y-4">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <p><strong>{documentLabel}:</strong> {documentValue}</p>
                <p className="mt-2">
                    <strong>Estado documento:</strong>{" "}
                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                        {documentStatus}
                    </span>
                </p>
            </div>

            {hasFixes && (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-900">
                    <p className="text-sm">Datos corregidos. Reenvíe el documento para que SISGEN lo valide de nuevo.</p>
                    {onResend && (
                        <button
                            type="button"
                            onClick={onResend}
                            className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-emerald-700"
                        >
                            <RotateCw className="h-3 w-3" />
                            Reenviar a SISGEN
                        </button>
                    )}
                </div>
            )}

            <div>
                <p className="mb-2 font-semibold">
                    {errors.length ? `Qué corregir (${errors.length})` : "Errores SISGEN"}
                </p>
                {errors.length ? (
                    <div className="space-y-2">
                        {errors.map((error, idx) => (
                            <SisgenErrorItem key={idx} error={error} fix={fix} />
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-600">Sin errores.</p>
                )}
            </div>

            {hasTechnicalDetail && (
                <details className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                    <summary className="cursor-pointer font-medium text-slate-600">Detalle técnico del envío</summary>
                    <div className="mt-2 space-y-1">
                        <p><strong>SOAP status:</strong> {soapStatus}</p>
                        {submission.http_status != null && <p><strong>HTTP status:</strong> {submission.http_status}</p>}
                        {submission.batch_index != null && <p><strong>Lote:</strong> {submission.batch_index}</p>}
                        {submission.soap_return_message && (
                            <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded border border-slate-200 bg-white p-2 font-mono text-[11px]">
                                {submission.soap_return_message}
                            </pre>
                        )}
                    </div>
                </details>
            )}
        </div>
    )
}

export default SisgenLastSubmissionView
