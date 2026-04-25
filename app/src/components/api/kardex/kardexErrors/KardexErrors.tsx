import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const KardexErrors = () => {
  const summaryCards = [
    { title: "PDT Errores", value: "24", trend: "+3 esta semana", tone: "text-rose-600" },
    { title: "SISGEN Enviados", value: "186", trend: "92% del total", tone: "text-emerald-600" },
    { title: "SISGEN No Enviados", value: "16", trend: "Pendientes de revisión", tone: "text-amber-600" },
    { title: "Operaciones Observadas", value: "7", trend: "Requiere seguimiento", tone: "text-indigo-600" },
  ]

  const statusRows = [
    { operation: "Compraventa", pdt: "2 errores", sisgen: "48 enviados / 3 no enviados", state: "En revisión" },
    { operation: "Poder General", pdt: "0 errores", sisgen: "25 enviados / 1 no enviado", state: "Estable" },
    { operation: "Sucesión Intestada", pdt: "4 errores", sisgen: "19 enviados / 6 no enviados", state: "Crítico" },
    { operation: "Testamento", pdt: "1 error", sisgen: "9 enviados / 0 no enviados", state: "Estable" },
  ]

  const sisgenData = [
    { name: "Compraventa", enviados: 48, noEnviados: 3 },
    { name: "Poder General", enviados: 25, noEnviados: 1 },
    { name: "Sucesión", enviados: 19, noEnviados: 6 },
    { name: "Testamento", enviados: 9, noEnviados: 0 },
  ]

  const pdtPieData = [
    { name: "Sin error", value: 78, color: "#10b981" },
    { name: "Con error", value: 24, color: "#ef4444" },
  ]

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-700 px-6 py-4 text-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-300">Panel General</p>
            <h2 className="text-lg font-semibold">Resumen de Operaciones Notariales</h2>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-300">Periodo</span>
            <select className="rounded-md border border-slate-500 bg-slate-100 px-2 py-1 text-slate-700">
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 border-b border-slate-200 bg-slate-50/70 p-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.title} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{card.title}</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">{card.value}</p>
            <p className={`mt-1 text-xs font-medium ${card.tone}`}>{card.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 border-b border-slate-200 p-4 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm xl:col-span-2">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            SISGEN - Enviados vs No Enviados
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sisgenData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis dataKey="name" tick={{ fill: "#475569", fontSize: 11 }} />
                <YAxis tick={{ fill: "#475569", fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="enviados" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="noEnviados" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            PDT - Estado General
          </p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pdtPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={80}
                  label
                >
                  {pdtPieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <div className="grid min-w-[720px] grid-cols-4 gap-2 bg-slate-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
            <p>Operación</p>
            <p>PDT</p>
            <p>SISGEN</p>
            <p>Estado</p>
          </div>
          {statusRows.map((row, index) => (
            <div
              key={row.operation}
              className={`grid min-w-[720px] grid-cols-4 gap-2 px-3 py-2 text-sm text-slate-700 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
            >
              <p className="font-medium">{row.operation}</p>
              <p>{row.pdt}</p>
              <p>{row.sisgen}</p>
              <p>{row.state}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Mock visual sin conexión a datos reales. Luego se puede enlazar a servicios de PDT y SISGEN.
        </p>
      </div>
    </div>
  )
}

export default KardexErrors