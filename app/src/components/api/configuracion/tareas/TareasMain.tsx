import { Clock, Loader2, RefreshCw } from "lucide-react"
import useAuthStore from "../../../../store/useAuthStore"
import useGetCeleryStatus from "../../../../hooks/celery/useGetCeleryStatus"
import type { CelerySunatItem } from "../../../../services/celery/celeryStatusService"
import { formatLocalDate } from "../../../../utils/formatLocalDate"

const formatDateTime = (value?: string | null) => {
    if (!value) return "—"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return formatLocalDate(value)
    return date.toLocaleString("es-PE", {
        dateStyle: "short",
        timeStyle: "short",
    })
}

const displayValue = (value: string | number | null | undefined) => {
    if (value == null || value === "") return "—"
    return String(value)
}

const SunatItemsTable = ({
    items,
    emptyLabel,
}: {
    items: CelerySunatItem[]
    emptyLabel: string
}) => {
    if (items.length === 0) {
        return (
            <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 py-8 text-center text-sm text-slate-500">
                {emptyLabel}
            </p>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                        <th className="px-2 py-2 font-semibold">ID</th>
                        <th className="px-2 py-2 font-semibold">Recibo</th>
                        <th className="px-2 py-2 font-semibold">Estado</th>
                        <th className="px-2 py-2 font-semibold">Reintentos</th>
                        <th className="px-2 py-2 font-semibold">Próx. reintento</th>
                        <th className="px-2 py-2 font-semibold">Error</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr
                            key={item.id ?? `${item.recibo_id ?? "row"}-${index}`}
                            className="border-b border-slate-100"
                        >
                            <td className="px-2 py-2 font-mono text-xs text-slate-700">
                                {displayValue(item.id)}
                            </td>
                            <td className="px-2 py-2 font-mono text-xs text-slate-700">
                                {displayValue(item.recibo_id)}
                            </td>
                            <td className="px-2 py-2 text-xs text-slate-700">
                                {displayValue(item.status)}
                            </td>
                            <td className="px-2 py-2 text-xs text-slate-700">
                                {displayValue(item.retry_count)}
                            </td>
                            <td className="px-2 py-2 text-xs text-slate-700">
                                {formatDateTime(item.next_retry_at)}
                            </td>
                            <td className="max-w-xs truncate px-2 py-2 text-xs text-red-700">
                                {item.last_error?.trim() || "—"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

const TareasMain = () => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { data, isLoading, isError, error, isFetching, refetch } =
        useGetCeleryStatus({ access })

    const beatTasks = data?.beat_tasks ?? []
    const retries = data?.sunat_retries ?? []
    const failed = data?.sunat_failed ?? []

    return (
        <section className="space-y-4 px-4 py-6">
            <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Sistema
                    </p>
                    <h1 className="text-2xl font-bold text-slate-900">Tareas</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Estado de Celery Beat y reintentos SUNAT.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                >
                    {isFetching ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                    ) : (
                        <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                    )}
                    Actualizar
                </button>
            </header>

            {isLoading && (
                <p className="rounded-xl border border-slate-200 bg-white py-10 text-center text-sm text-slate-500 animate-pulse">
                    Cargando tareas…
                </p>
            )}

            {isError && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">
                    {error instanceof Error
                        ? error.message
                        : "No se pudo cargar el estado de Celery."}
                </p>
            )}

            {!isLoading && !isError && (
                <>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center gap-2">
                            <Clock className="h-4 w-4 text-sky-600" aria-hidden />
                            <h2 className="text-sm font-semibold text-slate-800">
                                Beat tasks
                            </h2>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                                {beatTasks.length}
                            </span>
                        </div>
                        {beatTasks.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 py-8 text-center text-sm text-slate-500">
                                No hay tareas beat registradas.
                            </p>
                        ) : (
                            <ul className="space-y-3">
                                {beatTasks.map((task) => (
                                    <li
                                        key={task.name}
                                        className="rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-3"
                                    >
                                        <p className="font-mono text-xs font-semibold text-slate-800">
                                            {task.name}
                                        </p>
                                        <p className="mt-0.5 font-mono text-[11px] text-slate-500">
                                            {task.task}
                                        </p>
                                        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
                                            <div>
                                                <dt className="text-slate-500">Tipo</dt>
                                                <dd className="font-medium text-slate-800">
                                                    {task.type}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-slate-500">Schedule</dt>
                                                <dd className="font-medium text-slate-800">
                                                    {task.schedule ||
                                                        (task.every_seconds
                                                            ? `cada ${task.every_seconds}s`
                                                            : "—")}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-slate-500">Última</dt>
                                                <dd className="font-medium text-slate-800">
                                                    {formatDateTime(task.last_run_at)}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-slate-500">Próxima</dt>
                                                <dd className="font-medium text-slate-800">
                                                    {formatDateTime(task.next_run_at)}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-slate-500">Ejecuciones</dt>
                                                <dd className="font-medium text-slate-800">
                                                    {task.run_count ?? "—"}
                                                </dd>
                                            </div>
                                        </dl>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h2 className="mb-3 text-sm font-semibold text-slate-800">
                            SUNAT retries
                            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                                {retries.length}
                            </span>
                        </h2>
                        <SunatItemsTable
                            items={retries}
                            emptyLabel="No hay reintentos SUNAT pendientes."
                        />
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <h2 className="mb-3 text-sm font-semibold text-slate-800">
                            SUNAT failed
                            <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700">
                                {failed.length}
                            </span>
                        </h2>
                        <SunatItemsTable
                            items={failed}
                            emptyLabel="No hay envíos SUNAT fallidos."
                        />
                    </div>
                </>
            )}
        </section>
    )
}

export default TareasMain
