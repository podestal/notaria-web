import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { FileSearch, Loader2, RefreshCw, RotateCcw, Unlock } from "lucide-react"
import useAuthStore from "../../../../store/useAuthStore"
import useKardexTypesStore from "../../../../hooks/store/useKardexTypesStore"
import useGetAdminReservations from "../../../../hooks/signatum/useGetAdminReservations"
import type {
  AdminReservation,
  AdminReservationsFilters,
} from "../../../../services/signatum/adminReservationsService"
import getTitleCase from "../../../../utils/getTitleCase"
import Paginator from "../../../ui/Paginator"
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
import ReleaseReservationModal from "./ReleaseReservationModal"
import ReverseReservationModal from "./ReverseReservationModal"

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "PE", label: "Pendiente (PE)" },
  { value: "CO", label: "Comprometida (CO)" },
  { value: "EX", label: "Expirada (EX)" },
  { value: "CA", label: "Cancelada (CA)" },
]

const PAGE_SIZE = 10

const GRID =
  "70px minmax(100px,1fr) minmax(110px,1.1fr) 72px 80px 70px 100px 100px minmax(110px,1.1fr) 110px 100px"

const statusBadgeClass = (status: string) => {
  switch (status) {
    case "PE":
      return "bg-amber-50 text-amber-700 ring-amber-100"
    case "CO":
      return "bg-emerald-50 text-emerald-700 ring-emerald-100"
    case "CA":
      return "bg-rose-50 text-rose-700 ring-rose-100"
    case "EX":
      return "bg-slate-100 text-slate-600 ring-slate-200"
    default:
      return "bg-slate-100 text-slate-600 ring-slate-200"
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

const ReservacionesList = () => {
  const access = useAuthStore((s) => s.access_token) || ""
  const kardexTypes = useKardexTypesStore((s) => s.kardexTypes)

  const [status, setStatus] = useState("")
  const [idtipkar, setIdtipkar] = useState("")
  const [kardex, setKardex] = useState("")
  const [heldBy, setHeldBy] = useState("")
  const [page, setPage] = useState(1)
  const [releasing, setReleasing] = useState<AdminReservation | null>(null)
  const [reversing, setReversing] = useState<AdminReservation | null>(null)
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
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50/40 px-4 py-2.5 sm:px-6">
        <p className="text-xs text-slate-500">
          Listado de reservaciones notariales, liberación y reversión
        </p>
        <motion.button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          whileHover={isFetching ? undefined : { y: -1 }}
          whileTap={isFetching ? undefined : { scale: 0.96 }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            aria-hidden
          />
          Actualizar
        </motion.button>
      </div>

      <ExtraFiltersShell title="Búsqueda por:" onSubmit={handleApplyFilters} columns={2}>
        <ExtraFilterSelectField
          label="Estado"
          value={status}
          onChange={setStatus}
          options={STATUS_OPTIONS}
          index={0}
        />
        <ExtraFilterSelectField
          label="Tipo kardex"
          value={idtipkar}
          onChange={setIdtipkar}
          options={tipkarOptions}
          index={1}
        />
        <ExtraFilterTextField
          label="Kardex"
          value={kardex}
          onChange={setKardex}
          placeholder="Ej. A143-2026"
          index={2}
        />
        <ExtraFilterTextField
          label="Held by"
          value={heldBy}
          onChange={setHeldBy}
          placeholder="Id usuario"
          index={3}
        />
        <ExtraFilterSearchButton loading={false} label="Aplicar" index={4} colSpan={1} />
        <ExtraFilterSearchButton
          type="button"
          variant="clear"
          label="Limpiar"
          onClick={handleClearFilters}
          index={5}
          colSpan={1}
        />
      </ExtraFiltersShell>

      {isLoading && (
        <LoadingState message="Cargando reservaciones…" description="Signatum" />
      )}

      {isError && (
        <p className="my-8 text-center text-sm text-rose-600">
          Error al cargar reservaciones: {error.message}
        </p>
      )}

      {!isLoading && !isError && (
        <ExtraTableShell
          count={totalCount}
          label="reservaciones"
          hint={
            isFetching
              ? "Actualizando…"
              : "Liberar (PE) o revertir (CO) desde cada fila"
          }
          minWidth="1100px"
          footer={
            <Paginator
              page={page}
              setPage={setPage}
              itemsCount={totalCount}
              itemsPerPage={PAGE_SIZE}
            />
          }
        >
          <div className={EXTRA_HEADER_CLASS} style={{ gridTemplateColumns: GRID }}>
            <p>ID</p>
            <p>Kardex</p>
            <p>Tipo</p>
            <p>Estado</p>
            <p>Escritura</p>
            <p>Minuta</p>
            <p>Folios</p>
            <p>Fec. esc.</p>
            <p>Held by</p>
            <p>Creado</p>
            <p className="text-right">Acciones</p>
          </div>

          {reservations.length === 0 ? (
            <motion.div
              {...emptyMotionProps}
              className="flex flex-col items-center justify-center gap-2 px-4 py-14 text-center"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <FileSearch className="h-5 w-5" aria-hidden />
              </span>
              <p className="text-sm font-medium text-slate-600">
                No hay reservaciones para estos filtros
              </p>
            </motion.div>
          ) : (
            <div className="divide-y divide-slate-100">
              {reservations.map((item, index) => (
                <motion.div
                  key={item.id}
                  {...rowMotion(index)}
                  className={EXTRA_ROW_CLASS}
                  style={{ gridTemplateColumns: GRID }}
                >
                  <div>
                    <span className={EXTRA_ID_BADGE_CLASS}>{item.id}</span>
                  </div>
                  <p className="truncate font-semibold text-sky-700">
                    {item.kardex || <Empty />}
                  </p>
                  <p className="leading-snug text-slate-600">{tipkarLabel(item.idtipkar)}</p>
                  <div>
                    <span
                      className={`inline-flex rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1 ${statusBadgeClass(item.status)}`}
                    >
                      {item.status || "—"}
                    </span>
                  </div>
                  <p className="tabular-nums text-slate-700">{item.num_escritura || <Empty />}</p>
                  <p className="tabular-nums text-slate-700">{item.num_minuta || <Empty />}</p>
                  <p className="tabular-nums text-[11px] text-slate-600">
                    {item.folio_ini || item.folio_fin
                      ? `${item.folio_ini || "—"}–${item.folio_fin || "—"}`
                      : <Empty />}
                  </p>
                  <p className="tabular-nums text-[11px] text-slate-600">
                    {item.fecha_escritura || <Empty />}
                  </p>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">
                      {item.held_by_username || <Empty />}
                    </p>
                    <p className="text-[10px] text-slate-400">id {item.held_by}</p>
                  </div>
                  <p className="text-[11px] text-slate-500">{formatDateTime(item.created_at)}</p>
                  <div className="flex justify-end">
                    {item.status === "PE" ? (
                      <button
                        type="button"
                        onClick={() => setReleasing(item)}
                        className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-700 transition hover:bg-rose-100"
                      >
                        <Unlock className="h-3 w-3" aria-hidden />
                        Liberar
                      </button>
                    ) : item.status === "CO" ? (
                      <button
                        type="button"
                        onClick={() => setReversing(item)}
                        className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700 transition hover:bg-amber-100"
                      >
                        <RotateCcw className="h-3 w-3" aria-hidden />
                        Revertir
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-300">—</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {isFetching && !isLoading && (
            <p className="flex items-center justify-center gap-1.5 border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400">
              <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
              Actualizando…
            </p>
          )}
        </ExtraTableShell>
      )}

      <ReleaseReservationModal
        reservation={releasing}
        onClose={() => setReleasing(null)}
      />
      <ReverseReservationModal
        reservation={reversing}
        onClose={() => setReversing(null)}
      />
    </div>
  )
}

export default ReservacionesList
