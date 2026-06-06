import { AlertTriangle, UserRound } from "lucide-react"
import type { User } from "../../../../services/auth/userService"
import { getUsuarioDisplayName } from "../../../../services/api/usuariosService"
import getTitleCase from "../../../../utils/getTitleCase"
import LinkTaxesUsuarioSelector from "./LinkTaxesUsuarioSelector"

interface Props {
    user: User
}

const formatDate = (iso: string | null) => {
    if (!iso) return "—"
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
}

const getMappingAlerts = (user: User): string[] => {
    const alerts: string[] = []
    if (user.taxes_usuario_id == null) {
        alerts.push("Sin usuario de taxes enlazado")
    }
    if (user.negocio_id == null) {
        alerts.push("Sin negocio enlazado")
    }
    return alerts
}

const UserMappingCard = ({ user }: Props) => {
    const alerts = getMappingAlerts(user)
    const needsMapping = alerts.length > 0
    const displayName = getTitleCase(getUsuarioDisplayName(user))

    return (
        <article
            className={`rounded-lg border bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md ${
                needsMapping ? "border-red-300" : "border-slate-200"
            }`}
        >
            {needsMapping && (
                <div
                    className="mb-3 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900"
                    role="alert"
                >
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden />
                    <div>
                        <p className="font-semibold">Enlace pendiente</p>
                        <ul className="mt-1 list-disc pl-4">
                            {alerts.map((alert) => (
                                <li key={alert}>{alert}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 flex-1 gap-3">
                    <div
                        className={`rounded-xl border p-2 ${
                            needsMapping
                                ? "border-red-300/40 bg-red-100/60"
                                : "border-sky-400/20 bg-sky-500/10"
                        }`}
                    >
                        <UserRound
                            className={`h-5 w-5 ${
                                needsMapping ? "text-red-700" : "text-sky-600"
                            }`}
                            aria-hidden
                        />
                    </div>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-slate-700">
                                #{user.idusuario}
                            </span>
                            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                                {user.username}
                            </span>
                            <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                    user.is_active
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-slate-200 text-slate-600"
                                }`}
                            >
                                {user.is_active ? "Activo" : "Inactivo"}
                            </span>
                        </div>
                        <h3 className="mt-1 text-sm font-medium leading-snug text-slate-900">
                            {displayName}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-500">{user.email}</p>
                    </div>
                </div>
            </div>

            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 pt-3 text-[11px] sm:grid-cols-4">
                <div>
                    <dt className="text-slate-500">Taxes usuario ID</dt>
                    <dd
                        className={`font-medium ${
                            user.taxes_usuario_id == null
                                ? "text-red-700"
                                : "text-slate-800"
                        }`}
                    >
                        {user.taxes_usuario_id ?? "—"}
                    </dd>
                </div>
                <div>
                    <dt className="text-slate-500">Negocio ID</dt>
                    <dd
                        className={`font-medium ${
                            user.negocio_id == null ? "text-red-700" : "text-slate-800"
                        }`}
                    >
                        {user.negocio_id ?? "—"}
                    </dd>
                </div>
                <div>
                    <dt className="text-slate-500">Notaría</dt>
                    <dd className="font-medium text-slate-800">{user.notary}</dd>
                </div>
                <div>
                    <dt className="text-slate-500">Último acceso</dt>
                    <dd className="font-medium text-slate-800">
                        {formatDate(user.last_login)}
                    </dd>
                </div>
            </dl>

            {(user.taxes_usuario_id == null || user.negocio_id == null) && (
                <LinkTaxesUsuarioSelector idusuario={user.idusuario} />
            )}
        </article>
    )
}

export default UserMappingCard
