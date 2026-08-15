import type { SunatStatusValue } from "../../../services/taxes/sunatStatus"
import {
    getBoletaSunatLabel,
    getSunatStatusLabel,
    type BoletaSunatDisplay,
} from "../../../services/taxes/sunatStatus"

interface Props {
    status: SunatStatusValue | null
    compact?: boolean
}

const STATUS_CLASSES: Record<SunatStatusValue, string> = {
    accepted: "bg-emerald-100 text-emerald-800",
    sunat_down: "bg-amber-100 text-amber-800",
    rejected: "bg-red-100 text-red-800",
}

const BOLETA_CLASSES: Record<BoletaSunatDisplay, string> = {
    accepted: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
    enviada: "bg-sky-100 text-sky-800",
    pend_resumen: "bg-amber-100 text-amber-800",
}

const SunatStatusBadge = ({ status, compact = false }: Props) => {
    if (!status) return null

    return (
        <span
            className={`rounded-full font-semibold uppercase tracking-wide ${
                STATUS_CLASSES[status]
            } ${compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-[11px]"}`}
        >
            {getSunatStatusLabel(status)}
        </span>
    )
}

export const BoletaSunatBadge = ({
    display,
    compact = false,
}: {
    display: BoletaSunatDisplay
    compact?: boolean
}) => (
    <span
        className={`rounded-full font-semibold uppercase tracking-wide ${
            BOLETA_CLASSES[display]
        } ${compact ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-[11px]"}`}
    >
        {getBoletaSunatLabel(display)}
    </span>
)

export default SunatStatusBadge
