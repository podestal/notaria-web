import { useMemo, useState } from "react"
import { Loader2, RefreshCw, Unlock } from "lucide-react"
import useAuthStore from "../../../../store/useAuthStore"
import useKardexTypesStore from "../../../../hooks/store/useKardexTypesStore"
import useGetAdminReservations from "../../../../hooks/signatum/useGetAdminReservations"
import type {
  AdminReservation,
  AdminReservationsFilters,
} from "../../../../services/signatum/adminReservationsService"
import getTitleCase from "../../../../utils/getTitleCase"
import Paginator from "../../../ui/Paginator"
import ReleaseReservationModal from "./ReleaseReservationModal"

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "PE", label: "Pendiente (PE)" },
  { value: "EX", label: "Expirada (EX)" },
  { value: "CA", label: "Cancelada (CA)" },
]

const PAGE_SIZE = 10

const statusBadgeClass = (status: string) => {
  switch (status) {
    case "PE":
      return "bg-amber-100 text-amber-800 ring-amber-200"
    case "CO":
      return "bg-emerald-100 text-emerald-800 ring-emerald-200"
    case "CA":
      return "bg-rose-100 text-rose-800 ring-rose-200"
    case "EX":
      return "bg-slate-200 text-slate-700 ring-slate-300"
    default:
      return "bg-slate-100 text-slate-700 ring-slate-200"
  }
}

const formatDateTime = (value: string) => {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  })
}

const ReservacionesList = () => {
  const access = useAuthStore((s) => s.access_token) || ""
  const kardexTypes = useKardexTypesStore((s) => s.kardexTypes)

  const [status, setStatus] = useState("")
  const [idtipkar, setIdtipkar] = useState("")
  const [kardex, setKardex] = useState("")
  const [heldBy, setHeldBy] = useState("")
  const [page, setPage] = useState(1)
  const [releasing, setReleasing] = useState<AdminReservation | null>(null)
  const [appliedFilters, setAppliedFilters] = useState<
    Omit<AdminReservationsFilters, "page" | "page_size">
  >({})

  const filters = useMemo(
    (): AdminReservationsFilters => ({
      status: appliedFilters.status || undefined,
      idtipkar: appliedFilters.idtipkar || undefined,
      kardex: appliedFilters.kardex || undefined,
      held_by: appliedFilters.held_by || undefined,
      page,
      page_size: PAGE_SIZE,
    }),
    [appliedFilters, page]
  )

  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetAdminReservations({
      access,
      filters,
      enabled: Boolean(access),
    })

  const reservations = data?.results ?? []
  const totalCount = data?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  const tipkarLabel = (id: number) => {
    const found = kardexTypes.find((t) => t.idtipkar === id)
    return found ? getTitleCase(found.nomtipkar) : String(id)
  }

  const handleApplyFilters = () => {
    setPage(1)
    setAppliedFilters({
      status: status.trim() || undefined,
      idtipkar: idtipkar.trim() || undefined,
      kardex: kardex.trim() || undefined,
      held_by: heldBy.trim() || undefined,
    })
  }

  const handleClearFilters = () => {
    setStatus("")
    setIdtipkar("")
    setKardex("")
    setHeldBy("")
    setPage(1)
    setAppliedFilters({})
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Reservaciones</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Listado de reservaciones notariales y liberación forzada.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            aria-hidden
          />
          Actualizar
        </button>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Filtros
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-xs font-semibold text-slate-600">
            Estado
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Tipo de kardex
            <select
              value={idtipkar}
              onChange={(e) => setIdtipkar(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            >
              <option value="">Todos</option>
              {kardexTypes.map((type) => (
                <option key={type.idtipkar} value={String(type.idtipkar)}>
                  {getTitleCase(type.nomtipkar)}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Kardex
            <input
              value={kardex}
              onChange={(e) => setKardex(e.target.value)}
              placeholder="Ej. A143-2026"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Held by (id usuario)
            <input
              value={heldBy}
              onChange={(e) => setHeldBy(e.target.value)}
              placeholder="Ej. 28"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleApplyFilters}
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
          >
            Aplicar filtros
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Limpiar
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <p className="text-sm font-semibold text-slate-800">
            {totalCount} reservación{totalCount === 1 ? "" : "es"}
            {totalCount > 0 && (
              <span className="ml-2 font-normal text-slate-500">
                · página {page} de {totalPages}
              </span>
            )}
          </p>
          {isFetching && !isLoading && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
              Actualizando…
            </span>
          )}
        </div>

        {isLoading && (
          <p className="p-8 text-center text-sm text-slate-500 animate-pulse">
            Cargando reservaciones...
          </p>
        )}

        {isError && (
          <p className="p-8 text-center text-sm text-rose-600">
            Error al cargar reservaciones: {error.message}
          </p>
        )}

        {!isLoading && !isError && reservations.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-500">
            No hay reservaciones para los filtros seleccionados.
          </p>
        )}

        {!isLoading && !isError && reservations.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-[1100px] w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-100 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                  <tr>
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Kardex</th>
                    <th className="px-3 py-2">Tipo</th>
                    <th className="px-3 py-2">Estado</th>
                    <th className="px-3 py-2">Escritura</th>
                    <th className="px-3 py-2">Minuta</th>
                    <th className="px-3 py-2">Folios</th>
                    <th className="px-3 py-2">Fecha escritura</th>
                    <th className="px-3 py-2">Held by</th>
                    <th className="px-3 py-2">Creado</th>
                    <th className="px-3 py-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((item, index) => (
                    <tr
                      key={item.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className="px-3 py-2 font-mono text-xs">{item.id}</td>
                      <td className="px-3 py-2 font-semibold text-sky-700">
                        {item.kardex || "—"}
                      </td>
                      <td className="px-3 py-2">{tipkarLabel(item.idtipkar)}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${statusBadgeClass(item.status)}`}
                        >
                          {item.status || "—"}
                        </span>
                      </td>
                      <td className="px-3 py-2">{item.num_escritura || "—"}</td>
                      <td className="px-3 py-2">{item.num_minuta || "—"}</td>
                      <td className="px-3 py-2">
                        {item.folio_ini || item.folio_fin
                          ? `${item.folio_ini || "—"} – ${item.folio_fin || "—"}`
                          : "—"}
                      </td>
                      <td className="px-3 py-2">{item.fecha_escritura || "—"}</td>
                      <td className="px-3 py-2">
                        <p className="font-medium">
                          {item.held_by_username || "—"}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          id {item.held_by}
                        </p>
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-600">
                        {formatDateTime(item.created_at)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {item.status === "PE" ? (
                          <button
                            type="button"
                            onClick={() => setReleasing(item)}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-300 bg-rose-50 px-2.5 py-1.5 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-100"
                          >
                            <Unlock className="h-3.5 w-3.5" aria-hidden />
                            Liberar
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Paginator
              page={page}
              setPage={setPage}
              itemsCount={totalCount}
              itemsPerPage={PAGE_SIZE}
            />
          </>
        )}
      </section>

      <ReleaseReservationModal
        reservation={releasing}
        onClose={() => setReleasing(null)}
      />
    </div>
  )
}

export default ReservacionesList
