import { useEffect, useState } from "react"
import { AlertTriangle, Clock } from "lucide-react"

interface Props {
    /** Expiration instant in epoch milliseconds. */
    expiresAt: number
}

const formatRemaining = (ms: number) => {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${String(seconds).padStart(2, "0")}`
}

const ReservationCountdown = ({ expiresAt }: Props) => {
    const [now, setNow] = useState(() => Date.now())
    const remaining = expiresAt - now
    const expired = remaining <= 0

    useEffect(() => {
        setNow(Date.now())
    }, [expiresAt])

    useEffect(() => {
        if (expired) return
        const id = window.setInterval(() => setNow(Date.now()), 1000)
        return () => window.clearInterval(id)
    }, [expired, expiresAt])

    if (expired) {
        return (
            <span
                role="status"
                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
            >
                <AlertTriangle className="h-4 w-4" aria-hidden />
                Reserva expirada · vuelva a obtener datos
            </span>
        )
    }

    const warning = remaining <= 60_000

    return (
        <span
            role="timer"
            aria-live="off"
            title="Tiempo restante para guardar con los datos reservados"
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold tabular-nums ${
                warning
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-sky-200 bg-sky-50 text-sky-700"
            }`}
        >
            <Clock className="h-4 w-4" aria-hidden />
            Reserva: {formatRemaining(remaining)}
        </span>
    )
}

export default ReservationCountdown
