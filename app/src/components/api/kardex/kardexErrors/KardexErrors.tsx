import { useMemo, useState } from "react"
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

const formatPercent = (rate: number) => `${Math.round(rate * 100)}%`

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
        sisgen: user.counts.sisgen,
        uif: user.counts.uif,
        pdt: user.counts.pdt,
      })),
    [data?.users],
  )

  if (isLoading) {
    return (
      <p className="p-8 text-center text-sm text-slate-600 animate-pulse">
        Cargando resumen de cumplimiento...
      </p>
    )
  }

  if (isError) {
    return (
      <p className="p-8 text-center text-sm text-red-600">
        Error al cargar cumplimiento: {error.message}
      </p>
    )
  }

  if (!data) return null

  const { summary, period, users, year } = data
  const cleanKardex = summary.total_kardex - summary.kardex_with_errors

  const summaryCards = [
    {
      title: "Kardex del periodo",
      value: String(summary.total_kardex),
      trend: `${summary.total_users} usuarios`,
      tone: "text-slate-600",
    },
    {
      title: "Kardex con errores",
      value: String(summary.kardex_with_errors),
      trend: `${cleanKardex} sin errores`,
      tone: "text-rose-600",
    },
    {
      title: "Errores SISGEN",
      value: String(summary.counts.sisgen),
      trend: "solo errores",
      tone: "text-amber-600",
    },
    {
      title: "Errores UIF",
      value: String(summary.counts.uif),
      trend: `${summary.counts.pdt} PDT`,
      tone: "text-indigo-600",
    },
    {
      title: "Total errores",
      value: String(summary.counts.total),
      trend: "SISGEN + UIF + PDT",
      tone: "text-rose-600",
    },
  ]

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-700 px-6 py-4 text-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-300">Panel General</p>
            <h2 className="text-lg font-semibold">Resumen de Operaciones Notariales</h2>
            <p className="mt-1 text-xs text-slate-300">
              {period.start} — {period.end} · {period.date_field}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-300">Periodo</span>
            <span className="rounded-md border border-slate-500 bg-slate-100 px-2 py-1 font-semibold text-slate-700">
              {year}
            </span>
            <select
              className="rounded-md border border-slate-500 bg-slate-100 px-2 py-1 text-slate-700"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {MONTH_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 border-b border-slate-200 bg-slate-50/70 p-4 md:grid-cols-2 xl:grid-cols-5">
        {summaryCards.map((card) => (
          <div key={card.title} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{card.title}</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">{card.value}</p>
            <p className={`mt-1 text-xs font-medium ${card.tone}`}>{card.trend}</p>
          </div>
        ))}
      </div>

      {chartData.length > 0 && (
        <div className="grid grid-cols-1 gap-4 border-b border-slate-200 p-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Errores por usuario
            </p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#475569", fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sisgen" name="SISGEN" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="uif" name="UIF" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pdt" name="PDT" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      <div className="p-4">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <div className="grid min-w-[900px] grid-cols-7 gap-2 bg-slate-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            <p>Usuario</p>
            <p>Kardex</p>
            <p>Con errores</p>
            <p>Sin errores</p>
            <p>% errores</p>
            <p>SISGEN / UIF / PDT</p>
            <p>Total errores</p>
          </div>
          {users.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-slate-500">
              No hay datos de usuarios para este periodo.
            </p>
          ) : (
            users.map((user, index) => (
              <div
                key={user.idusuario}
                className={`grid min-w-[900px] grid-cols-7 gap-2 px-3 py-2 text-sm text-slate-700 ${
                  index % 2 === 0 ? "bg-white" : "bg-slate-50"
                }`}
              >
                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedUser(user)}
                    className="text-left font-medium text-sky-700 hover:text-sky-900 hover:underline"
                  >
                    {getTitleCase(user.name || user.username)}
                  </button>
                  <p className="text-xs text-slate-500">{user.username}</p>
                </div>
                <p>{user.total_kardex}</p>
                <p>{user.kardex_with_errors}</p>
                <p>{user.kardex_clean}</p>
                <p>{formatPercent(user.error_rate)}</p>
                <p>
                  {user.counts.sisgen} / {user.counts.uif} / {user.counts.pdt}
                </p>
                <p>{user.counts.total}</p>
              </div>
            ))
          )}
        </div>
        {summary.pdt_note && (
          <p className="mt-3 text-xs text-slate-500">{summary.pdt_note}</p>
        )}
      </div>

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
