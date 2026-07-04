import type { SisgenSendJobDocument } from "../../../services/sisgen/sisgenSendJobService"

const DOC_STATUS_LABELS: Record<string, string> = {
    pending: "Pendiente",
    running: "En proceso",
    completed: "Completado",
    failed: "Fallido",
    skipped: "Omitido",
}

const DOC_STATUS_CLASSES: Record<string, string> = {
    pending: "bg-slate-100 text-slate-700",
    running: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    skipped: "bg-amber-100 text-amber-800",
}

interface Props {
    documents: SisgenSendJobDocument[]
    title?: string
    maxHeightClass?: string
    showAttempt?: boolean
}

const SisgenJobDocumentsTable = ({
    documents,
    title,
    maxHeightClass = "max-h-[50vh]",
    showAttempt = false,
}: Props) => {
    if (documents.length === 0) return null

    return (
        <div className="overflow-hidden rounded-lg border border-slate-200">
            {title && (
                <p className="bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                    {title}
                </p>
            )}
            <div className="grid grid-cols-12 gap-2 bg-slate-100 px-3 py-2 text-[10px] font-semibold uppercase text-slate-600">
                <p className="col-span-3">Kardex</p>
                <p className="col-span-2">Estado</p>
                {showAttempt && <p className="col-span-2">Intento</p>}
                <p className={showAttempt ? "col-span-5" : "col-span-7"}>Mensaje</p>
            </div>
            <ul className={`divide-y divide-slate-100 overflow-y-auto ${maxHeightClass}`}>
                {documents.map((doc) => (
                    <li
                        key={`${doc.idkardex ?? ""}-${doc.kardex}-${doc.batch_index ?? 0}-${doc.status}`}
                        className="grid grid-cols-12 gap-2 px-3 py-2 text-xs text-slate-800"
                    >
                        <p className="col-span-3 font-mono font-medium">{doc.kardex}</p>
                        <p className="col-span-2">
                            <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                    DOC_STATUS_CLASSES[doc.status]
                                    ?? DOC_STATUS_CLASSES.pending
                                }`}
                            >
                                {DOC_STATUS_LABELS[doc.status] ?? doc.status}
                            </span>
                        </p>
                        {showAttempt && (
                            <p className="col-span-2 text-slate-600">{doc.attempt ?? "—"}</p>
                        )}
                        <p
                            className={`${showAttempt ? "col-span-5" : "col-span-7"} text-slate-600`}
                            title={doc.message ?? ""}
                        >
                            {doc.message || "—"}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SisgenJobDocumentsTable
