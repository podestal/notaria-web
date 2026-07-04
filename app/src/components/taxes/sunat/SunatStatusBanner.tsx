import type { SunatStatus } from "../../services/taxes/sunatStatus"
import { formatSunatNextRetry, getSunatStatusLabel } from "../../services/taxes/sunatStatus"

interface Props {
    sunat?: SunatStatus | null
    detailMessage?: string | null
    className?: string
}

const SunatStatusBanner = ({ sunat, detailMessage, className = "" }: Props) => {
    if (!sunat) return null

    const toneClasses = {
        accepted: "border-emerald-200 bg-emerald-50 text-emerald-900",
        sunat_down: "border-amber-200 bg-amber-50 text-amber-900",
        rejected: "border-red-200 bg-red-50 text-red-900",
    }

    const retryLabel = formatSunatNextRetry(sunat.next_retry_at)
    const message = detailMessage || sunat.message || sunat.msj_sunat || sunat.last_error

    return (
        <div
            className={`rounded-lg border px-4 py-3 text-sm ${toneClasses[sunat.status]} ${className}`}
            role="status"
        >
            <p className="font-semibold">{getSunatStatusLabel(sunat.status)}</p>
            {message && <p className="mt-1 text-xs leading-relaxed opacity-90">{message}</p>}
            {sunat.status === "sunat_down" && retryLabel && (
                <p className="mt-1 text-xs font-medium">
                    Próximo reintento automático: {retryLabel}
                    {sunat.retry_count != null && sunat.retry_count > 0 && (
                        <span className="ml-1 opacity-80">
                            (intento {sunat.retry_count})
                        </span>
                    )}
                </p>
            )}
            {sunat.status === "rejected" && sunat.cod_sunat && (
                <p className="mt-1 font-mono text-[11px] opacity-80">
                    Código SUNAT: {sunat.cod_sunat}
                </p>
            )}
        </div>
    )
}

export default SunatStatusBanner
