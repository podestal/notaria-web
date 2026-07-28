import { useMemo, useState } from "react"
import { Loader2, Pencil, Plus, RefreshCw, Sparkles } from "lucide-react"
import useAuthStore from "../../../../store/useAuthStore"
import useKardexTypesStore from "../../../../hooks/store/useKardexTypesStore"
import useGetAdminCounters from "../../../../hooks/signatum/useGetAdminCounters"
import useGetAdminFreedSlots from "../../../../hooks/signatum/useGetAdminFreedSlots"
import useEnsureAdminCounter from "../../../../hooks/signatum/useEnsureAdminCounter"
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore"
import type {
  AdminCounter,
  AdminCountersFilters,
  AdminFreedSlot,
} from "../../../../services/signatum/adminCountersService"
import getTitleCase from "../../../../utils/getTitleCase"
import EditCounterModal from "./EditCounterModal"
import SetCounterModal from "./SetCounterModal"

const formatDateTime = (value: string) => {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  })
}

const freedSlotsKey = (year: number, idtipkar: number) => `${year}:${idtipkar}`

interface Props {
  /** When true, omit outer page chrome (used inside Reservaciones tabs). */
  embedded?: boolean
}

const ContadoresMain = ({ embedded = false }: Props) => {
  const access = useAuthStore((s) => s.access_token) || ""
  const notify = useNotificationsStore((s) => s.notify)
  const kardexTypes = useKardexTypesStore((s) => s.kardexTypes)

  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [idtipkar, setIdtipkar] = useState("")
  const [appliedFilters, setAppliedFilters] = useState<AdminCountersFilters>({
    year: String(new Date().getFullYear()),
  })
  const [editing, setEditing] = useState<AdminCounter | null>(null)
  const [setOpen, setSetOpen] = useState(false)

  const ensureCounter = useEnsureAdminCounter()

  const filters = useMemo(
    (): AdminCountersFilters => ({
      year: appliedFilters.year || undefined,
      idtipkar: appliedFilters.idtipkar || undefined,
    }),
    [appliedFilters]
  )

  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetAdminCounters({
      access,
      filters,
      enabled: Boolean(access),
    })

  const {
    data: freedSlotsPage,
    isLoading: isLoadingFreed,
    isError: isErrorFreed,
    error: freedError,
    refetch: refetchFreed,
    isFetching: isFetchingFreed,
  } = useGetAdminFreedSlots({
    access,
    filters,
    enabled: Boolean(access),
  })

  const counters = data ?? []
  const freedResults = freedSlotsPage?.results ?? []

  const freedByKey = useMemo(() => {
    const map = new Map<string, AdminFreedSlot[]>()
    for (const row of freedResults) {
      map.set(freedSlotsKey(row.year, row.idtipkar), row.freed_slots ?? [])
    }
    return map
  }, [freedResults])

  const totalFreedSlots = useMemo(
    () => freedResults.reduce((sum, row) => sum + (row.freed_slots?.length ?? 0), 0),
    [freedResults]
  )

  const tipkarLabel = (id: number) => {
    const found = kardexTypes.find((t) => t.idtipkar === id)
    return found ? getTitleCase(found.nomtipkar) : String(id)
  }

  const handleApplyFilters = () => {
    setAppliedFilters({
      year: year.trim() || undefined,
      idtipkar: idtipkar.trim() || undefined,
    })
  }

  const handleClearFilters = () => {
    const currentYear = String(new Date().getFullYear())
    setYear(currentYear)
    setIdtipkar("")
    setAppliedFilters({ year: currentYear })
  }

  const handleRefresh = () => {
    void refetch()
    void refetchFreed()
  }

  const handleEnsure = () => {
    const yearNum = Number(year)
    const tipkarNum = Number(idtipkar)
    if (!Number.isFinite(yearNum) || yearNum < 2000) {
      notify("error", "Indique un año válido para seed.")
      return
    }
    if (!Number.isFinite(tipkarNum) || tipkarNum <= 0) {
      notify("error", "Seleccione un tipo de kardex para seed.")
      return
    }

    ensureCounter.mutate(
      { access, year: yearNum, idtipkar: tipkarNum },
      {
        onSuccess: (res) => {
          notify(
            "success",
            `Contador listo: ${res.year} / tipkar ${res.idtipkar} (id ${res.id}).`
          )
          setAppliedFilters({
            year: String(yearNum),
            idtipkar: String(tipkarNum),
          })
        },
        onError: (err) => {
          notify("error", err.message || "No se pudo obtener/crear el contador.")
        },
      }
    )
  }

  const isRefreshing = (isFetching && !isLoading) || (isFetchingFreed && !isLoadingFreed)

  return (
    <div className={embedded ? "space-y-4" : "mx-auto max-w-7xl space-y-4 px-4 py-6"}>
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {!embedded && (
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Signatum
            </p>
          )}
          <h2 className={embedded ? "text-lg font-semibold text-slate-900" : "text-2xl font-bold text-slate-900"}>
            Contadores
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Numeración de escritura, minuta y folio por año y tipo de kardex.
            Incluye liberados tras reversiones.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSetOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Set / reset
          </button>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              aria-hidden
            />
            Actualizar
          </button>
        </div>
      </header>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Filtros
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-xs font-semibold text-slate-600">
            Año
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
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
          <button
            type="button"
            onClick={handleEnsure}
            disabled={ensureCounter.isPending}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-100 disabled:opacity-60"
            title="GET by-key: crea/seed el contador si no existe (no consume número)"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {ensureCounter.isPending ? "Seed…" : "Seed by-key"}
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <p className="text-sm font-semibold text-slate-800">
            {counters.length} contador{counters.length === 1 ? "" : "es"}
          </p>
          {isRefreshing && (
            <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
              Actualizando…
            </span>
          )}
        </div>

        {isLoading && (
          <p className="p-8 text-center text-sm text-slate-500 animate-pulse">
            Cargando contadores...
          </p>
        )}

        {isError && (
          <p className="p-8 text-center text-sm text-rose-600">
            Error al cargar contadores: {error.message}
          </p>
        )}

        {!isLoading && !isError && counters.length === 0 && (
          <p className="p-8 text-center text-sm text-slate-500">
            No hay contadores para los filtros seleccionados. Use Seed by-key o
            Set / reset para crear uno.
          </p>
        )}

        {!isLoading && !isError && counters.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Año</th>
                  <th className="px-3 py-2">Tipo</th>
                  <th className="px-3 py-2">Next escritura</th>
                  <th className="px-3 py-2">Next minuta</th>
                  <th className="px-3 py-2">Last folio</th>
                  <th className="px-3 py-2">Gaps liberados</th>
                  <th className="px-3 py-2">Actualizado</th>
                  <th className="px-3 py-2 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {counters.map((item, index) => {
                  const slots =
                    freedByKey.get(freedSlotsKey(item.year, item.idtipkar)) ?? []

                  return (
                    <tr
                      key={item.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className="px-3 py-2 font-mono text-xs">{item.id}</td>
                      <td className="px-3 py-2 font-semibold">{item.year}</td>
                      <td className="px-3 py-2">
                        <p>{tipkarLabel(item.idtipkar)}</p>
                        <p className="text-[11px] text-slate-500">
                          idtipkar {item.idtipkar}
                        </p>
                      </td>
                      <td className="px-3 py-2 font-mono">
                        {item.next_num_escritura}
                      </td>
                      <td className="px-3 py-2 font-mono">
                        {item.next_num_minuta}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs">
                        {item.last_folio || "—"}
                      </td>
                      <td className="px-3 py-2">
                        {slots.length === 0 ? (
                          <span className="text-[11px] text-slate-400">Ninguno</span>
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {slots.map((slot) => (
                              <span
                                key={`${slot.num_escritura}-${slot.folio}`}
                                className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-800 ring-1 ring-amber-200"
                                title={`Escritura ${slot.num_escritura} · folio ${slot.folio}`}
                              >
                                <span className="font-mono">#{slot.num_escritura}</span>
                                <span className="text-amber-600">f{slot.folio}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-600">
                        {formatDateTime(item.updated_at)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          type="button"
                          onClick={() => setEditing(item)}
                          className="inline-flex items-center gap-1 rounded-lg border border-sky-300 bg-sky-50 px-2.5 py-1.5 text-[11px] font-semibold text-sky-700 transition hover:bg-sky-100"
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden />
                          Editar
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-amber-100 bg-amber-50/60 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-amber-950">
              Gaps liberados
            </p>
            <p className="text-[11px] text-amber-800/80">
              Números de escritura disponibles tras revertir reservaciones
              comprometidas.
            </p>
          </div>
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900 ring-1 ring-amber-200">
            {totalFreedSlots} hueco{totalFreedSlots === 1 ? "" : "s"}
          </span>
        </div>

        {isLoadingFreed && (
          <p className="p-6 text-center text-sm text-slate-500 animate-pulse">
            Cargando gaps liberados...
          </p>
        )}

        {isErrorFreed && (
          <p className="p-6 text-center text-sm text-rose-600">
            Error al cargar gaps: {freedError.message}
          </p>
        )}

        {!isLoadingFreed && !isErrorFreed && totalFreedSlots === 0 && (
          <p className="p-6 text-center text-sm text-slate-500">
            No hay gaps liberados para los filtros seleccionados.
          </p>
        )}

        {!isLoadingFreed && !isErrorFreed && totalFreedSlots > 0 && (
          <div className="divide-y divide-slate-100">
            {freedResults.map((row) => {
              const slots = row.freed_slots ?? []
              if (slots.length === 0) return null

              return (
                <div
                  key={freedSlotsKey(row.year, row.idtipkar)}
                  className="px-4 py-3"
                >
                  <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {tipkarLabel(row.idtipkar)}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {row.year} · idtipkar {row.idtipkar} · next escritura{" "}
                      <span className="font-mono text-slate-700">
                        {row.next_num_escritura}
                      </span>
                      {row.last_folio ? (
                        <>
                          {" "}
                          · last folio{" "}
                          <span className="font-mono text-slate-700">
                            {row.last_folio}
                          </span>
                        </>
                      ) : null}
                    </p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-[320px] w-full max-w-md text-left text-sm text-slate-700">
                      <thead className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="pb-1.5 pr-4">Nº escritura</th>
                          <th className="pb-1.5">Folio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {slots.map((slot) => (
                          <tr
                            key={`${row.year}-${row.idtipkar}-${slot.num_escritura}`}
                            className="border-t border-slate-100"
                          >
                            <td className="py-1.5 pr-4 font-mono font-semibold text-amber-900">
                              {slot.num_escritura}
                            </td>
                            <td className="py-1.5 font-mono text-xs text-slate-600">
                              {slot.folio || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <EditCounterModal
        counter={editing}
        onClose={() => setEditing(null)}
      />
      <SetCounterModal
        isOpen={setOpen}
        onClose={() => setSetOpen(false)}
        defaultYear={
          appliedFilters.year ? Number(appliedFilters.year) : undefined
        }
        defaultIdtipkar={
          appliedFilters.idtipkar
            ? Number(appliedFilters.idtipkar)
            : undefined
        }
      />
    </div>
  )
}

export default ContadoresMain
