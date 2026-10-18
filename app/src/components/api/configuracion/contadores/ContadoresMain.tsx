import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { FileSearch, Pencil, Plus, RefreshCw, Sparkles } from "lucide-react"
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
import LoadingState from "../../../ui/LoadingState"
import ExtraFiltersShell, {
  ExtraFilterSearchButton,
  ExtraFilterSelectField,
  ExtraFilterTextField,
} from "../../extraprotocolares/ExtraFiltersShell"
import ExtraTableShell, {
  EXTRA_HEADER_CLASS,
  EXTRA_ID_BADGE_CLASS,
  EXTRA_ROW_CLASS,
} from "../../extraprotocolares/ExtraTableShell"
import { emptyMotionProps } from "../../extraprotocolares/rowMotion"
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

const COUNTERS_GRID =
  "70px 70px minmax(140px,1.4fr) 100px 100px 90px minmax(160px,1.6fr) 110px 90px"

const Empty = () => <span className="text-slate-300">—</span>

const rowMotion = (index: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.28,
    delay: Math.min(index, 12) * 0.03,
    ease: "easeOut" as const,
  },
})

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

  const tipkarOptions = [
    { value: "", label: "Todos" },
    ...kardexTypes.map((type) => ({
      value: String(type.idtipkar),
      label: getTitleCase(type.nomtipkar),
    })),
  ]

  const handleApplyFilters = (e?: React.FormEvent) => {
    e?.preventDefault()
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

  const body = (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50/40 px-4 py-2.5 sm:px-6">
        <div>
          {!embedded && (
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Signatum
            </p>
          )}
          <p className="text-xs text-slate-500">
            Numeración de escritura, minuta y folio · gaps liberados tras reversiones
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <motion.button
            type="button"
            onClick={() => setSetOpen(true)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-600 bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden />
            Set / reset
          </motion.button>
          <motion.button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            whileHover={isRefreshing ? undefined : { y: -1 }}
            whileTap={isRefreshing ? undefined : { scale: 0.96 }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`}
              aria-hidden
            />
            Actualizar
          </motion.button>
        </div>
      </div>

      <ExtraFiltersShell title="Búsqueda por:" onSubmit={handleApplyFilters} columns={2}>
        <ExtraFilterTextField
          label="Año"
          value={year}
          onChange={setYear}
          placeholder="2026"
          index={0}
        />
        <ExtraFilterSelectField
          label="Tipo kardex"
          value={idtipkar}
          onChange={setIdtipkar}
          options={tipkarOptions}
          index={1}
        />
        <ExtraFilterSearchButton label="Aplicar" index={2} colSpan={1} />
        <div className="flex flex-wrap items-center justify-end gap-1.5 md:col-span-1">
          <ExtraFilterSearchButton
            type="button"
            variant="clear"
            label="Limpiar"
            onClick={handleClearFilters}
            index={3}
            colSpan={1}
          />
          <motion.button
            type="button"
            onClick={handleEnsure}
            disabled={ensureCounter.isPending}
            whileHover={ensureCounter.isPending ? undefined : { y: -1 }}
            whileTap={ensureCounter.isPending ? undefined : { scale: 0.96 }}
            title="GET by-key: crea/seed el contador si no existe (no consume número)"
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 shadow-sm transition hover:bg-amber-100 disabled:opacity-60"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            {ensureCounter.isPending ? "Seed…" : "Seed by-key"}
          </motion.button>
        </div>
      </ExtraFiltersShell>

      {isLoading && (
        <LoadingState message="Cargando contadores…" description="Numeración Signatum" />
      )}

      {isError && (
        <p className="my-8 text-center text-sm text-rose-600">
          Error al cargar contadores: {error.message}
        </p>
      )}

      {!isLoading && !isError && (
        <ExtraTableShell
          count={counters.length}
          label="contadores"
          hint="Edite next escritura / minuta / folio por fila"
          minWidth="1000px"
        >
          <div className={EXTRA_HEADER_CLASS} style={{ gridTemplateColumns: COUNTERS_GRID }}>
            <p>ID</p>
            <p>Año</p>
            <p>Tipo</p>
            <p>Next esc.</p>
            <p>Next min.</p>
            <p>Last folio</p>
            <p>Gaps liberados</p>
            <p>Actualizado</p>
            <p className="text-right">Acciones</p>
          </div>

          {counters.length === 0 ? (
            <motion.div
              {...emptyMotionProps}
              className="flex flex-col items-center justify-center gap-2 px-4 py-14 text-center"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FileSearch className="h-5 w-5" aria-hidden />
              </span>
              <p className="text-sm font-medium text-slate-600">
                No hay contadores para estos filtros
              </p>
              <p className="text-xs text-slate-400">Use Seed by-key o Set / reset para crear uno</p>
            </motion.div>
          ) : (
            <div className="divide-y divide-slate-100">
              {counters.map((item, index) => {
                const slots =
                  freedByKey.get(freedSlotsKey(item.year, item.idtipkar)) ?? []

                return (
                  <motion.div
                    key={item.id}
                    {...rowMotion(index)}
                    className={EXTRA_ROW_CLASS}
                    style={{ gridTemplateColumns: COUNTERS_GRID }}
                  >
                    <div>
                      <span className={EXTRA_ID_BADGE_CLASS}>{item.id}</span>
                    </div>
                    <p className="font-semibold tabular-nums text-slate-800">{item.year}</p>
                    <div className="min-w-0">
                      <p className="truncate leading-snug text-slate-800">
                        {tipkarLabel(item.idtipkar)}
                      </p>
                      <p className="text-[10px] text-slate-400">idtipkar {item.idtipkar}</p>
                    </div>
                    <p className="font-mono tabular-nums text-slate-700">
                      {item.next_num_escritura}
                    </p>
                    <p className="font-mono tabular-nums text-slate-700">
                      {item.next_num_minuta}
                    </p>
                    <p className="font-mono text-[11px] text-slate-600">
                      {item.last_folio || <Empty />}
                    </p>
                    <div>
                      {slots.length === 0 ? (
                        <span className="text-[11px] text-slate-300">Ninguno</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {slots.map((slot) => (
                            <span
                              key={`${slot.num_escritura}-${slot.folio}`}
                              className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 ring-1 ring-amber-100"
                              title={`Escritura ${slot.num_escritura} · folio ${slot.folio}`}
                            >
                              <span className="font-mono">#{slot.num_escritura}</span>
                              <span className="text-amber-600">f{slot.folio}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {formatDateTime(item.updated_at)}
                    </p>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setEditing(item)}
                        className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-[11px] font-semibold text-sky-700 transition hover:bg-sky-100"
                      >
                        <Pencil className="h-3 w-3" aria-hidden />
                        Editar
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </ExtraTableShell>
      )}

      <div className="border-t border-slate-200 p-3 sm:p-4">
        <div className="overflow-hidden rounded-xl border border-amber-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 bg-amber-50/70 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-amber-900">Gaps liberados</p>
              <p className="text-[11px] text-amber-700/80">
                Números de escritura disponibles tras revertir reservaciones comprometidas
              </p>
            </div>
            <span className="rounded-md bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 ring-1 ring-amber-100">
              {totalFreedSlots} hueco{totalFreedSlots === 1 ? "" : "s"}
            </span>
          </div>

          {isLoadingFreed && (
            <LoadingState message="Cargando gaps…" description="Escrituras liberadas" />
          )}

          {isErrorFreed && (
            <p className="p-6 text-center text-sm text-rose-600">
              Error al cargar gaps: {freedError.message}
            </p>
          )}

          {!isLoadingFreed && !isErrorFreed && totalFreedSlots === 0 && (
            <p className="p-8 text-center text-sm text-slate-500">
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
                    <div className="flex flex-wrap gap-1.5">
                      {slots.map((slot) => (
                        <span
                          key={`${row.year}-${row.idtipkar}-${slot.num_escritura}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-100 bg-amber-50/80 px-2.5 py-1.5 text-xs"
                        >
                          <span className="font-mono font-semibold text-amber-800">
                            #{slot.num_escritura}
                          </span>
                          <span className="text-[10px] text-amber-700/80">
                            folio {slot.folio || "—"}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

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
    </>
  )

  if (embedded) {
    return <div>{body}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      {body}
    </motion.div>
  )
}

export default ContadoresMain
