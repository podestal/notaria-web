import { useEffect, useState } from "react"
import { ExternalLink, Printer, X } from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import {
    fetchIngresoPdfBlob,
    type Ingreso,
} from "../../../services/taxes/ingresosService"
import TopModal from "../../ui/TopModal"

interface Props {
    ingreso: Ingreso | null
    onClose: () => void
}

const IngresoPdfModal = ({ ingreso, onClose }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (!ingreso || !access) {
            setPdfUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev)
                return null
            })
            setError("")
            setLoading(false)
            return
        }

        let cancelled = false
        let objectUrl: string | null = null

        const loadPdf = async () => {
            setLoading(true)
            setError("")
            setPdfUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev)
                return null
            })

            try {
                const blob = await fetchIngresoPdfBlob(ingreso.id_ingreso, access)
                if (cancelled) return

                objectUrl = URL.createObjectURL(blob)
                setPdfUrl(objectUrl)
            } catch {
                if (!cancelled) {
                    setError("No se pudo cargar el PDF del ingreso.")
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        void loadPdf()

        return () => {
            cancelled = true
            if (objectUrl) URL.revokeObjectURL(objectUrl)
        }
    }, [ingreso, access])

    if (!ingreso) return null

    const comprobante = `${ingreso.serie || "—"}-${ingreso.numero ?? "—"}`

    const handlePrint = () => {
        const iframe = document.getElementById(
            `ingreso-pdf-${ingreso.id_ingreso}`,
        ) as HTMLIFrameElement | null
        iframe?.contentWindow?.print()
    }

    return (
        <TopModal isOpen={Boolean(ingreso)} onClose={onClose} portal wide deepth={70}>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <Printer className="h-4 w-4 text-sky-600" aria-hidden />
                            <h3 className="text-sm font-semibold text-slate-900">
                                Comprobante {comprobante}
                            </h3>
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Vista previa del PDF del ingreso
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {pdfUrl && (
                            <>
                                <a
                                    href={pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                                >
                                    <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                                    Abrir
                                </a>
                                <button
                                    type="button"
                                    onClick={handlePrint}
                                    className="inline-flex items-center gap-1 rounded-lg bg-sky-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-sky-700"
                                >
                                    <Printer className="h-3.5 w-3.5" aria-hidden />
                                    Imprimir
                                </button>
                            </>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50"
                            aria-label="Cerrar"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </header>

                <div className="relative min-h-0 flex-1 bg-slate-100">
                    {loading && (
                        <p className="absolute inset-0 flex items-center justify-center text-sm text-slate-500 animate-pulse">
                            Cargando PDF…
                        </p>
                    )}

                    {error && (
                        <p className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {pdfUrl && !loading && !error && (
                        <iframe
                            id={`ingreso-pdf-${ingreso.id_ingreso}`}
                            title={`PDF ingreso ${comprobante}`}
                            src={pdfUrl}
                            className="h-full min-h-[70vh] w-full border-0 bg-white"
                        />
                    )}
                </div>
            </div>
        </TopModal>
    )
}

export default IngresoPdfModal
