import { useEffect } from "react"
import { Loader } from "lucide-react"
import TopModal from "../../ui/TopModal"
import useSisgenSendPreview from "../../../hooks/sisgen/useSisgenSendPreview"
import type { SisgenSearchFilters } from "../../../utils/buildSisgenSearchFilters"
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
}

const SisgenSendAllPreviewModal = ({
    isOpen,
    onClose,
    access,
    filters,
}: Props) => {
    const preview = useSisgenSendPreview()

    useEffect(() => {
        if (!isOpen) {
            preview.reset()
            return
        }
        if (!filters || !access) return
        preview.mutate({ access, filters })
    }, [isOpen, filters, access])

    const data = preview.data
    const showList = data?.error === 0 && (data.documents?.length ?? 0) > 0

    return (
        <TopModal isOpen={isOpen} onClose={onClose} wide portal>
            <div className="flex max-h-[75vh] flex-col">
                <header className="mb-4 border-b border-slate-200 pb-3">
                    <h3 className="text-lg font-semibold text-slate-900">
                        Vista previa — Enviar a SISGEN
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Documentos que se enviarían con los filtros actuales de búsqueda.
                    </p>
                </header>

                {preview.isPending && (
                    <div className="flex flex-1 items-center justify-center gap-2 py-16 text-sm text-slate-500">
                        <Loader className="h-5 w-5 animate-spin" aria-hidden />
                        Cargando vista previa...
                    </div>
                )}

                {preview.isError && (
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

                {data && data.error !== 0 && (
                    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                        {data.message || "Error al obtener la vista previa."}
                    </p>
                )}

                {data?.error === 0 && (
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
                                    {ESTADO_LABELS[data.filters.estado] ??
                                        data.filters.estado}
                                </p>
                            </div>
                            <div className="col-span-2 sm:col-span-3">
                                <p className="font-semibold text-slate-500">
                                    Tipo de instrumento
                                </p>
                                <p className="mt-0.5 text-slate-800">
                                    {TIPO_INSTRUMENTO_LABELS[data.filters.tipoInstrumento] ??
                                        data.filters.tipoInstrumento}
                                </p>
                            </div>
                        </div>

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
                                <ul className="max-h-[40vh] overflow-y-auto divide-y divide-slate-100">
                                    {data.documents.map((doc, idx) => (
                                        <li
                                            key={`${doc.idkardex}-${doc.kardex}`}
                                            className="grid grid-cols-12 gap-2 px-3 py-2 text-xs text-slate-800"
                                        >
                                            <p className="col-span-1 text-slate-500">
                                                {idx + 1}
                                            </p>
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

                <div className="mt-4 flex justify-end border-t border-slate-100 pt-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </TopModal>
    )
}

export default SisgenSendAllPreviewModal
