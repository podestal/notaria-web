import { useState } from "react"
import ReservacionesList from "./ReservacionesList"
import ContadoresMain from "../contadores/ContadoresMain"

type TabId = "reservaciones" | "contadores"

const TABS: { id: TabId; label: string; hint: string }[] = [
  {
    id: "reservaciones",
    label: "Reservaciones",
    hint: "Reservas activas y liberaciones",
  },
  {
    id: "contadores",
    label: "Contadores",
    hint: "Escritura, minuta y folio",
  },
]

const ReservacionesMain = () => {
  const [tab, setTab] = useState<TabId>("reservaciones")

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-6">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          Signatum
        </p>
        <h1 className="text-2xl font-bold text-slate-900">
          Administración Signatum
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Gestiona reservaciones bloqueadas y contadores de numeración.
        </p>
      </header>

      <nav
        className="flex flex-wrap gap-2 border-b border-slate-200 pb-3"
        aria-label="Secciones Signatum"
      >
        {TABS.map((item) => {
          const active = tab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-lg px-4 py-2 text-left transition ${
                active
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              <p className="text-sm font-semibold">{item.label}</p>
              <p
                className={`text-[11px] ${
                  active ? "text-slate-300" : "text-slate-500"
                }`}
              >
                {item.hint}
              </p>
            </button>
          )
        })}
      </nav>

      {tab === "reservaciones" ? <ReservacionesList /> : <ContadoresMain embedded />}
    </div>
  )
}

export default ReservacionesMain
