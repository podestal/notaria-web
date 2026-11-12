import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Car, FileUp, Loader2, Trash2, Upload } from "lucide-react"
import useDeleteDocumentoBien from "../../../../hooks/documentos/useDeleteDocumentoBien"
import useGetDocumentosVehiculares from "../../../../hooks/documentos/useGetDocumentosVehiculares"
import useSubmitDocumentoVehicular from "../../../../hooks/documentos/useSubmitDocumentoVehicular"
import {
    isDocumentoLinked,
    type DocumentoBien,
} from "../../../../services/documentos/documentosVehicularesService"
import TopModal from "../../../ui/TopModal"

type FieldRow = { label: string; value?: string | null }

const FieldGrid = ({ title, rows }: { title: string; rows: FieldRow[] }) => {
    const visible = rows.filter((row) => (row.value || "").trim())
    if (visible.length === 0) return null
    return (
        <div className="mt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {title}
            </p>
            <dl className="grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-3">
                {visible.map((row) => (
                    <div key={row.label}>
                        <dt className="text-slate-500">{row.label}</dt>
                        <dd className="font-semibold text-slate-900">{row.value}</dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}

const statusTone = (status: DocumentoBien["status"]) => {
    if (status === "parsed") return "bg-emerald-100 text-emerald-700"
    if (status === "applied") return "bg-sky-100 text-sky-700"
    if (status === "error") return "bg-rose-100 text-rose-700"
    return "bg-slate-100 text-slate-600"
}

const formatWhen = (iso: string | null) => {
    if (!iso) return "—"
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleString("es-PE")
}

const DocumentosVehicularesMain = () => {
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [dragOver, setDragOver] = useState(false)
    const [flash, setFlash] = useState<{ tone: "ok" | "err"; text: string } | null>(null)
    const [lastResult, setLastResult] = useState<DocumentoBien | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [docToDelete, setDocToDelete] = useState<DocumentoBien | null>(null)
    const submit = useSubmitDocumentoVehicular()
    const removeDoc = useDeleteDocumentoBien()
    const {
        data,
        isPending,
        isFetching,
        isError: listError,
        error: listErr,
        refetch: refetchList,
    } = useGetDocumentosVehiculares()
    const docs = Array.isArray(data) ? data : []
    const listLoading = isPending || (isFetching && docs.length === 0)

    useEffect(() => {
        void refetchList()
    }, [refetchList])

    const parsedBlocks = useMemo(() => {
        const parsed = lastResult?.parsed as
            | {
                  vehiculo?: Record<string, string>
                  propietario?: Record<string, string>
                  meta?: Record<string, string>
              }
            | undefined
        return {
            vehiculo: parsed?.vehiculo ?? {},
            propietario: parsed?.propietario ?? {},
            meta: parsed?.meta ?? {},
        }
    }, [lastResult])

    const handleFile = (file: File | undefined | null) => {
        if (!file) return
        if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
            setFlash({ tone: "err", text: "Solo se admiten PDFs (Boleta Informativa SUNARP)" })
            return
        }
        setFlash(null)
        submit.mutate(file, {
            onSuccess: (data) => {
                setLastResult(data)
                void refetchList()
                if (data.status === "parsed") {
                    setFlash({
                        tone: "ok",
                        text: `Boleta guardada (#${data.id}): placa ${data.placa || "sin placa"}`,
                    })
                } else {
                    setFlash({
                        tone: "err",
                        text: data.parse_error || "No se pudo parsear el PDF",
                    })
                }
            },
            onError: (err) => {
                const detail =
                    (err as { response?: { data?: { detail?: string } } })?.response?.data
                        ?.detail || err.message
                setFlash({ tone: "err", text: detail || "Error al subir el PDF" })
            },
        })
    }

    const confirmDelete = () => {
        const doc = docToDelete
        if (!doc) return
        setDeletingId(doc.id)
        removeDoc.mutate(doc.id, {
            onSuccess: () => {
                if (lastResult?.id === doc.id) setLastResult(null)
                setFlash({ tone: "ok", text: `Boleta #${doc.id} eliminada` })
                setDocToDelete(null)
            },
            onError: (err) => {
                setFlash({
                    tone: "err",
                    text: err.message || `No se pudo eliminar #${doc.id}`,
                })
            },
            onSettled: () => setDeletingId(null),
        })
    }

    const { vehiculo, propietario, meta } = parsedBlocks

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mx-auto mb-10 mt-[80px] w-[92%] max-w-[1100px] text-slate-800"
        >
            <div className="keep-dark relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-slate-50 shadow-lg">
                <div className="relative flex flex-wrap items-center gap-3">
                    <div className="rounded-xl border border-sky-400/30 bg-sky-500/15 p-2.5">
                        <Car className="text-sky-300" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-sky-300/90">
                            Documentos
                        </p>
                        <h2 className="text-lg font-semibold text-white">Vehiculares</h2>
                        <p className="text-xs text-slate-400">
                            Sube la Boleta Informativa SUNARP (PDF) para extraer datos del bien
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Enviar PDF
                    </p>
                </div>

                <div className="p-5 sm:p-6">
                    {flash && (
                        <p
                            className={`mb-4 rounded-lg px-3 py-2 text-xs font-medium ${
                                flash.tone === "ok"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-rose-50 text-rose-700"
                            }`}
                        >
                            {flash.text}
                        </p>
                    )}
                    <input
                        ref={inputRef}
                        type="file"
                        accept="application/pdf,.pdf"
                        className="hidden"
                        onChange={(e) => {
                            handleFile(e.target.files?.[0])
                            e.target.value = ""
                        }}
                    />

                    <button
                        type="button"
                        disabled={submit.isPending}
                        onClick={() => inputRef.current?.click()}
                        onDragEnter={(e) => {
                            e.preventDefault()
                            setDragOver(true)
                        }}
                        onDragOver={(e) => {
                            e.preventDefault()
                            setDragOver(true)
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault()
                            setDragOver(false)
                        }}
                        onDrop={(e) => {
                            e.preventDefault()
                            setDragOver(false)
                            handleFile(e.dataTransfer.files?.[0])
                        }}
                        className={`flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 transition ${
                            dragOver
                                ? "border-sky-500 bg-sky-50"
                                : "border-slate-300 bg-slate-50 hover:border-sky-400 hover:bg-sky-50/60"
                        } ${submit.isPending ? "cursor-wait opacity-70" : "cursor-pointer"}`}
                    >
                        {submit.isPending ? (
                            <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
                        ) : (
                            <Upload className="h-8 w-8 text-sky-600" />
                        )}
                        <div className="text-center">
                            <p className="text-sm font-semibold text-slate-800">
                                {submit.isPending
                                    ? "Procesando boleta…"
                                    : "Arrastra el PDF aquí o haz clic para elegir"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                                Boleta Informativa vehicular · solo PDF · se guarda al parsear
                            </p>
                        </div>
                        {!submit.isPending && (
                            <span className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white">
                                <FileUp className="h-3.5 w-3.5" />
                                Seleccionar archivo
                            </span>
                        )}
                    </button>

                    {lastResult && (
                        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-slate-800">
                                    Último parseo · #{lastResult.id} · {lastResult.original_filename}
                                </p>
                                <span
                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusTone(
                                        lastResult.status,
                                    )}`}
                                >
                                    {lastResult.status}
                                </span>
                            </div>
                            {lastResult.parse_error ? (
                                <p className="mt-2 text-xs text-rose-600">
                                    {lastResult.parse_error}
                                </p>
                            ) : (
                                <>
                                    <FieldGrid
                                        title="Identificación"
                                        rows={[
                                            { label: "Placa", value: lastResult.placa || vehiculo.placa },
                                            { label: "Partida", value: lastResult.partida || vehiculo.partida },
                                            { label: "Oficina", value: lastResult.oficina || vehiculo.oficina },
                                            { label: "Condición", value: vehiculo.condicion },
                                            { label: "Estado", value: meta.estado_vehiculo },
                                        ]}
                                    />
                                    <FieldGrid
                                        title="Vehículo"
                                        rows={[
                                            { label: "Tipo uso", value: vehiculo.tipo_uso },
                                            { label: "Categoría", value: vehiculo.categoria },
                                            { label: "Carrocería", value: vehiculo.carroceria },
                                            { label: "Marca", value: vehiculo.marca },
                                            { label: "Modelo", value: vehiculo.modelo },
                                            { label: "Año fabricación", value: vehiculo.anio_fabricacion },
                                            { label: "Año modelo", value: vehiculo.anio_modelo },
                                            { label: "N° versión", value: vehiculo.numero_version },
                                            { label: "N° serie", value: vehiculo.numero_serie },
                                            { label: "VIN", value: vehiculo.vin },
                                            { label: "Color 1", value: vehiculo.color_1 },
                                            { label: "Color 2", value: vehiculo.color_2 },
                                            { label: "Color 3", value: vehiculo.color_3 },
                                            { label: "N° motor", value: vehiculo.numero_motor },
                                            { label: "Combustible", value: vehiculo.combustible },
                                            { label: "Pot. motor", value: vehiculo.potencia_motor },
                                            { label: "Cilindros", value: vehiculo.numero_cilindros },
                                            { label: "Cilindrada", value: vehiculo.cilindrada },
                                            { label: "N° ejes", value: vehiculo.numero_ejes },
                                            { label: "N° ruedas", value: vehiculo.numero_ruedas },
                                            { label: "Asientos", value: vehiculo.numero_asientos },
                                            { label: "Pasajeros", value: vehiculo.numero_pasajeros },
                                            { label: "Longitud", value: vehiculo.longitud },
                                            { label: "Ancho", value: vehiculo.ancho },
                                            { label: "Altura", value: vehiculo.altura },
                                            { label: "Peso neto", value: vehiculo.peso_neto },
                                            { label: "Peso bruto", value: vehiculo.peso_bruto },
                                            { label: "Carga útil", value: vehiculo.carga_util },
                                            { label: "Fórmula rodante", value: vehiculo.formula_rodante },
                                            {
                                                label: "Fecha inscripción",
                                                value: vehiculo.fecha_inscripcion,
                                            },
                                            {
                                                label: "Fecha propiedad",
                                                value: vehiculo.fecha_propiedad,
                                            },
                                        ]}
                                    />
                                    <FieldGrid
                                        title="Propietario"
                                        rows={[
                                            { label: "Nombre", value: propietario.nombre },
                                            { label: "DNI", value: propietario.dni },
                                            { label: "Dirección", value: propietario.direccion },
                                        ]}
                                    />
                                    <FieldGrid
                                        title="Meta boleta"
                                        rows={[
                                            { label: "Emitido", value: meta.emitido_en },
                                            { label: "Usuario", value: meta.usuario },
                                            { label: "N° transacción", value: meta.nro_transaccion },
                                            { label: "Pagado", value: meta.pagado },
                                            { label: "Afectaciones", value: meta.afectaciones },
                                            {
                                                label: "Datos adicionales",
                                                value: meta.datos_adicionales,
                                            },
                                        ]}
                                    />
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50/80 px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Boletas guardadas ({docs.length})
                    </p>
                    <button
                        type="button"
                        onClick={() => void refetchList()}
                        className="text-xs font-medium text-sky-700 hover:underline"
                    >
                        Actualizar
                    </button>
                </div>
                <div className="p-5 sm:p-6">
                    {listLoading ? (
                        <p className="text-xs text-slate-500">Cargando boletas…</p>
                    ) : listError ? (
                        <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
                            No se pudo cargar la lista: {listErr?.message || "error de red"}
                        </p>
                    ) : docs.length === 0 ? (
                        <p className="text-xs text-slate-500">
                            Aún no hay boletas. Sube un PDF arriba.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-left text-xs">
                                <thead className="border-b border-slate-200 text-[10px] uppercase tracking-wide text-slate-500">
                                    <tr>
                                        <th className="px-2 py-2 font-semibold">ID</th>
                                        <th className="px-2 py-2 font-semibold">Placa</th>
                                        <th className="px-2 py-2 font-semibold">Partida</th>
                                        <th className="px-2 py-2 font-semibold">Estado</th>
                                        <th className="px-2 py-2 font-semibold">Vínculo</th>
                                        <th className="px-2 py-2 font-semibold">Archivo</th>
                                        <th className="px-2 py-2 font-semibold">Creado</th>
                                        <th className="px-2 py-2 font-semibold" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {docs.map((doc) => {
                                        const linked = isDocumentoLinked(doc)
                                        return (
                                            <tr
                                                key={doc.id}
                                                className="border-b border-slate-100 align-top last:border-0"
                                            >
                                                <td className="px-2 py-2.5 font-semibold text-slate-800">
                                                    #{doc.id}
                                                </td>
                                                <td className="px-2 py-2.5 font-semibold text-slate-900">
                                                    {doc.placa || "—"}
                                                </td>
                                                <td className="px-2 py-2.5 text-slate-700">
                                                    {doc.partida || "—"}
                                                </td>
                                                <td className="px-2 py-2.5">
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${statusTone(
                                                            doc.status,
                                                        )}`}
                                                    >
                                                        {doc.status}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-2.5">
                                                    {linked ? (
                                                        <div>
                                                            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-700">
                                                                Vinculada
                                                            </span>
                                                            <p className="mt-1 text-[11px] text-slate-600">
                                                                {doc.kardex || "—"}
                                                                {doc.detveh != null
                                                                    ? ` · detveh ${doc.detveh}`
                                                                    : ""}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                                                            Pendiente
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="max-w-[180px] truncate px-2 py-2.5 text-slate-600">
                                                    {doc.original_filename}
                                                </td>
                                                <td className="whitespace-nowrap px-2 py-2.5 text-slate-500">
                                                    {formatWhen(doc.created_at)}
                                                </td>
                                                <td className="px-2 py-2.5 text-right">
                                                    <button
                                                        type="button"
                                                        disabled={deletingId === doc.id}
                                                        onClick={() => setDocToDelete(doc)}
                                                        className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                                                    >
                                                        {deletingId === doc.id ? (
                                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        )}
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <TopModal
                isOpen={Boolean(docToDelete)}
                onClose={() => {
                    if (!deletingId) setDocToDelete(null)
                }}
                portal
            >
                <div className="px-2 py-6 text-center">
                    <h2 className="text-xl font-bold text-slate-900">
                        ¿Eliminar esta boleta?
                    </h2>
                    {docToDelete && (
                        <div className="mt-3 space-y-1 text-sm text-slate-600">
                            <p>
                                #{docToDelete.id}
                                {docToDelete.placa ? ` · placa ${docToDelete.placa}` : ""}
                                {docToDelete.partida
                                    ? ` · partida ${docToDelete.partida}`
                                    : ""}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                                {docToDelete.original_filename}
                            </p>
                            {isDocumentoLinked(docToDelete) && (
                                <p className="text-xs font-medium text-amber-700">
                                    Está vinculada a {docToDelete.kardex || "kardex"}
                                    {docToDelete.detveh != null
                                        ? ` · detveh ${docToDelete.detveh}`
                                        : ""}
                                </p>
                            )}
                        </div>
                    )}
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <button
                            type="button"
                            disabled={Boolean(deletingId)}
                            onClick={confirmDelete}
                            className="rounded bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-60"
                        >
                            {deletingId ? "Eliminando…" : "Eliminar"}
                        </button>
                        <button
                            type="button"
                            disabled={Boolean(deletingId)}
                            onClick={() => setDocToDelete(null)}
                            className="rounded bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600 disabled:opacity-60"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </TopModal>
        </motion.div>
    )
}

export default DocumentosVehicularesMain
