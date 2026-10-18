import { useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  FileWarning,
  LayoutDashboard,
  Users,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import useGetComplianceUsers from "../../../../hooks/compliance/useGetComplianceUsers"
import useAuthStore from "../../../../store/useAuthStore"
import getTitleCase from "../../../../utils/getTitleCase"
import type { ComplianceUser } from "../../../../services/compliance/complianceService"
import ComplianceUserKardexModal from "./ComplianceUserKardexModal"
import LoadingState from "../../../ui/LoadingState"

const MONTH_OPTIONS = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
]

const USERS_GRID =
  "minmax(180px,2fr) 80px 90px 90px 90px minmax(140px,1.4fr) 100px"

const formatPercent = (rate: number) => `${Math.round(rate * 100)}%`

const rowMotion = (index: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.28,
    delay: Math.min(index, 16) * 0.03,
    ease: "easeOut" as const,
  },
})

const KardexErrors = () => {
  const access = useAuthStore((s) => s.access_token) || ""
  const [month, setMonth] = useState(() => new Date().getMonth() + 1)
  const [selectedUser, setSelectedUser] = useState<ComplianceUser | null>(null)

  const { data, isLoading, isError, error } = useGetComplianceUsers({
    access,
    month,
  })

  const chartData = useMemo(
    () =>
      (data?.users ?? []).map((user) => ({
        name: getTitleCase(user.name || user.username),
        sisgen: user.counts?.sisgen ?? 0,
        uif: user.counts?.uif ?? 0,
        pdt: user.counts?.pdt ?? 0,
      })),
    [data?.users],
  )

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <LoadingState message="Cargando resumen…" description="Cumplimiento del periodo" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="overflow-hidden rounded-2xl border border-rose-200 bg-rose-50/60 p-8 text-center">
        <p className="text-sm font-medium text-rose-700">
          Error al cargar cumplimiento: {error.message}
        </p>
      </div>
    )
  }

  if (!data) return null

  const summary = data.summary
  const period = data.period
  const users = data.users ?? []
  const year = data.year

  if (!summary || !period) {
    return (
      <div className="overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-10 text-center text-sm text-slate-500">
        No hay resumen de kardex disponible para este periodo.
      </div>
    )
  }

  const totalKardex = summary.total_kardex ?? 0
  const kardexWithErrors = summary.kardex_with_errors ?? 0
  const totalUsers = summary.total_users ?? 0
  const counts = summary.counts ?? { sisgen: 0, uif: 0, pdt: 0, total: 0 }
  const cleanKardex = totalKardex - kardexWithErrors

  const summaryCards = [
    {
      title: "Kardex del periodo",
      value: String(totalKardex),
      trend: `${totalUsers} usuarios`,
      icon: LayoutDashboard,
      accent: "bg-sky-50 text-sky-600 ring-sky-100",
      valueTone: "text-slate-800",
      trendTone: "text-slate-500",
    },
    {
      title: "Kardex con errores",
      value: String(kardexWithErrors),
      trend: `${cleanKardex} sin errores`,
      icon: AlertTriangle,
      accent: "bg-rose-50 text-rose-600 ring-rose-100",
      valueTone: "text-rose-700",
      trendTone: "text-emerald-600",
    },
    {
      title: "Errores SISGEN",
      value: String(counts.sisgen),
      trend: "solo errores",
      icon: FileWarning,
      accent: "bg-amber-50 text-amber-600 ring-amber-100",
      valueTone: "text-amber-700",
      trendTone: "text-amber-600",
    },
    {
      title: "Errores UIF",
      value: String(counts.uif),
      trend: `${counts.pdt} PDT`,
      icon: Users,
      accent: "bg-indigo-50 text-indigo-600 ring-indigo-100",
      valueTone: "text-indigo-700",
      trendTone: "text-indigo-600",
    },
    {
      title: "Total errores",
      value: String(counts.total),
      trend: "SISGEN + UIF + PDT",
      icon: CheckCircle2,
      accent: "bg-rose-50 text-rose-600 ring-rose-100",
      valueTone: "text-rose-700",
      trendTone: "text-slate-500",
    },
  ]

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm">
      <div className="keep-dark relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-slate-100">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.55, 0.85, 0.55] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 left-1/4 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.45, 0.75, 0.45] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.08 }}
              className="rounded-xl border border-sky-400/30 bg-sky-500/15 p-2.5"
            >
              <BarChart3 className="text-sky-300" size={22} />
            </motion.div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-sky-300/90">Panel General</p>
              <h2 className="text-lg font-semibold text-white">Resumen de Operaciones Notariales</h2>
              <p className="mt-0.5 text-xs text-slate-400">
                {period.start ?? "—"} — {period.end ?? "—"}
                {period.date_field ? ` · ${period.date_field}` : ""}
              </p>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.35 }}
            className="flex items-center gap-2 rounded-xl border border-slate-600/80 bg-slate-800/70 px-3 py-2 text-xs"
          >
            <span className="text-slate-400">Periodo</span>
            <span className="rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-800">
              {year}
            </span>
            <select
              className="cursor-pointer rounded-md border border-slate-500 bg-slate-100 px-2 py-1 font-medium text-slate-800 outline-none focus:ring-2 focus:ring-sky-300"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {MONTH_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </motion.div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={month}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="grid grid-cols-1 gap-3 border-b border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-2 xl:grid-cols-5">
            {summaryCards.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.05 + i * 0.05,
                    ease: "easeOut",
                  }}
                  whileHover={{ y: -2 }}
                  className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {card.title}
                    </p>
                    <span
                      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ${card.accent}`}
                    >
                      <Icon size={15} aria-hidden />
                    </span>
                  </div>
                  <motion.p
                    key={`${card.title}-${card.value}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-2 text-2xl font-bold tabular-nums ${card.valueTone}`}
                  >
                    {card.value}
                  </motion.p>
                  <p className={`mt-1 text-xs font-medium ${card.trendTone}`}>{card.trend}</p>
                </motion.div>
              )
            })}
          </div>

          {chartData.length > 0 && (
            <div className="border-b border-slate-200 p-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.35 }}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600 ring-1 ring-sky-100">
                    <BarChart3 size={14} aria-hidden />
                  </span>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Errores por usuario
                  </p>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-slate-200)" />
                      <XAxis dataKey="name" tick={{ fill: "var(--color-slate-600)", fontSize: 11 }} />
                      <YAxis tick={{ fill: "var(--color-slate-600)", fontSize: 11 }} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 10,
                          border: "1px solid var(--color-slate-200)",
                          fontSize: 12,
                        }}
                      />
                      <Legend />
                      <Bar dataKey="sisgen" name="SISGEN" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="uif" name="UIF" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="pdt" name="PDT" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          )}

          <div className="p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-slate-800">{users.length}</span> usuarios en el periodo
              </p>
              <p className="text-[11px] text-slate-400">Haga clic en un usuario para ver kardex con errores</p>
            </div>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <div style={{ minWidth: 900 }}>
                  <div
                    className="sticky top-0 z-10 grid items-center gap-3 border-b border-slate-200 bg-slate-50/95 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 backdrop-blur"
                    style={{ gridTemplateColumns: USERS_GRID }}
                  >
                    <p>Usuario</p>
                    <p>Kardex</p>
                    <p>Con errores</p>
                    <p>Sin errores</p>
                    <p>% errores</p>
                    <p>SISGEN / UIF / PDT</p>
                    <p>Total</p>
                  </div>
                  {users.length === 0 ? (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="px-4 py-10 text-center text-sm text-slate-500"
                    >
                      No hay datos de usuarios para este periodo.
                    </motion.p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {users.map((user, index) => {
                        const errorRate = user.error_rate ?? 0
                        const rateBadge =
                          errorRate === 0
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                            : errorRate < 0.25
                              ? "bg-amber-50 text-amber-700 ring-amber-100"
                              : "bg-rose-50 text-rose-700 ring-rose-100"

                        return (
                          <motion.button
                            key={user.idusuario}
                            type="button"
                            {...rowMotion(index)}
                            onClick={() => setSelectedUser(user)}
                            className="group grid w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-xs text-slate-700 transition-colors hover:bg-sky-50/70"
                            style={{ gridTemplateColumns: USERS_GRID }}
                          >
                            <div className="min-w-0">
                              <p className="truncate font-semibold text-sky-700 transition group-hover:text-sky-900 group-hover:underline">
                                {getTitleCase(user.name || user.username)}
                              </p>
                              <p className="truncate text-[11px] text-slate-400">{user.username}</p>
                            </div>
                            <p className="tabular-nums font-medium text-slate-800">{user.total_kardex ?? 0}</p>
                            <p className="tabular-nums text-rose-600">{user.kardex_with_errors ?? 0}</p>
                            <p className="tabular-nums text-emerald-600">{user.kardex_clean ?? 0}</p>
                            <div>
                              <span className={`inline-flex rounded-md px-2 py-0.5 font-semibold tabular-nums ring-1 ${rateBadge}`}>
                                {formatPercent(errorRate)}
                              </span>
                            </div>
                            <p className="tabular-nums text-slate-600">
                              <span className="text-sky-600">{user.counts?.sisgen ?? 0}</span>
                              {" / "}
                              <span className="text-indigo-600">{user.counts?.uif ?? 0}</span>
                              {" / "}
                              <span className="text-amber-600">{user.counts?.pdt ?? 0}</span>
                            </p>
                            <p className="tabular-nums font-semibold text-slate-800">{user.counts?.total ?? 0}</p>
                          </motion.button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {summary.pdt_note && (
              <p className="mt-3 text-xs text-slate-500">{summary.pdt_note}</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <ComplianceUserKardexModal
        user={selectedUser}
        year={year}
        month={month}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  )
}

export default KardexErrors
