import type { SisgenLastSubmission } from "../../../services/sisgen/searchSisgenService"
import {
    formatSisgenSubmissionError,
    isSisgenSubmissionErrorObject,
    normalizeSisgenSubmissionErrors,
    type SisgenSubmissionError,
} from "../../../utils/sisgenSubmissionErrors"

interface Props {
    documentLabel: string
    documentValue: string
    submission: SisgenLastSubmission
}

const SisgenErrorItem = ({ error }: { error: SisgenSubmissionError }) => {
    if (!isSisgenSubmissionErrorObject(error)) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-3 py-2 whitespace-pre-wrap">
                {error}
            </div>
        )
    }

    return (
        <div className="space-y-2 rounded-md border border-red-200 bg-red-50 px-3 py-3 text-red-800">
            {(error.estado || error.soap_return_status) && (
                <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                    {error.estado || error.soap_return_status}
                </p>
            )}
            {error.mensaje_usuario && (
                <p className="whitespace-pre-wrap">{error.mensaje_usuario}</p>
            )}
            {error.mensaje_tecnico && (
                <details className="text-xs text-red-700">
                    <summary className="cursor-pointer font-medium text-red-600">
                        Detalle técnico
                    </summary>
                    <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded border border-red-200 bg-white p-2 font-mono text-[11px] text-slate-700">
                        {error.mensaje_tecnico}
                    </pre>
                </details>
            )}
            {error.nota_contacto_it && (
                <p className="rounded border border-amber-200 bg-amber-50 px-2 py-1.5 text-xs text-amber-900">
                    {error.nota_contacto_it}
                </p>
            )}
            {(error.http_status != null || error.batch != null) && (
                <p className="text-[11px] text-red-600">
                    {error.http_status != null && <>HTTP {error.http_status}</>}
                    {error.http_status != null && error.batch != null && " · "}
                    {error.batch != null && <>Lote {error.batch}</>}
                </p>
            )}
            {!error.mensaje_usuario && !error.mensaje_tecnico && (
                <p className="whitespace-pre-wrap">{formatSisgenSubmissionError(error)}</p>
            )}
        </div>
    )
}

const SisgenLastSubmissionView = ({ documentLabel, documentValue, submission }: Props) => {
    const documentStatus =
        submission.document_status
        || submission.errors?.find(isSisgenSubmissionErrorObject)?.estado
        || "-"

    const soapStatus =
        submission.soap_return_status
        || submission.errors?.find(isSisgenSubmissionErrorObject)?.soap_return_status
        || "-"

    const errors = normalizeSisgenSubmissionErrors(submission.errors)
    const hasStructuredMessage =
        Boolean(submission.soap_return_message)
        || errors.some(isSisgenSubmissionErrorObject)

    return (
        <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
                <p><strong>{documentLabel}:</strong> {documentValue}</p>
                <p className="mt-2">
                    <strong>Estado documento:</strong>{" "}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                        {documentStatus}
                    </span>
                </p>
                <p className="mt-2"><strong>SOAP status:</strong> {soapStatus}</p>
                {submission.http_status != null && (
                    <p className="mt-2"><strong>HTTP status:</strong> {submission.http_status}</p>
                )}
                {submission.batch_index != null && (
                    <p className="mt-2"><strong>Lote:</strong> {submission.batch_index}</p>
                )}
            </div>

            {submission.soap_return_message && (
                <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="font-semibold mb-1">Mensaje SISGEN</p>
                    <p className="whitespace-pre-wrap text-slate-700">{submission.soap_return_message}</p>
                </div>
            )}

            <div>
                <p className="font-semibold mb-2">Errores SISGEN</p>
                {errors.length ? (
                    <div className="space-y-2">
                        {errors.map((error, idx) => (
                            <SisgenErrorItem key={idx} error={error} />
                        ))}
                    </div>
                ) : hasStructuredMessage ? (
                    <p className="text-slate-600">Sin errores adicionales.</p>
                ) : (
                    <p className="text-slate-600">Sin errores.</p>
                )}
            </div>
        </div>
    )
}

export default SisgenLastSubmissionView
