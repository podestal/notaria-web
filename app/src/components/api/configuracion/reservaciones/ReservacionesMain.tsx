import { useState } from "react"
import { motion } from "framer-motion"
import { CalendarClock, Hash } from "lucide-react"
import ReservacionesList from "./ReservacionesList"
import ContadoresMain from "../contadores/ContadoresMain"

type TabId = "reservaciones" | "contadores"

const TABS: {
  id: TabId
  label: string
  hint: string
  icon: typeof CalendarClock
}[] = [
  {
    id: "reservaciones",
    label: "Reservaciones",
    hint: "Reservas activas y liberaciones",
    icon: CalendarClock,
  },
  {
    id: "contadores",
    label: "Contadores",
    hint: "Escritura, minuta y folio",
    icon: Hash,
  },
]

const ReservacionesMain = () => {
  const [tab, setTab] = useState<TabId>("reservaciones")

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
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
        <div className="relative flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.08 }}
            className="rounded-xl border border-sky-400/30 bg-sky-500/15 p-2.5"
          >
            <CalendarClock className="text-sky-300" size={22} />
          </motion.div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-sky-300/90">Configuración</p>
            <h1 className="text-lg font-semibold text-white">Administración Signatum</h1>
            <p className="mt-0.5 text-xs text-slate-400">
              Gestiona reservaciones bloqueadas y contadores de numeración
            </p>
          </div>
        </div>
      </div>

      <div
        className="flex gap-1 border-b border-slate-200 bg-slate-50/70 px-4 pt-3"
        role="tablist"
        aria-label="Secciones Signatum"
      >
        {TABS.map((item) => {
          const active = tab === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(item.id)}
              className={`relative -mb-px flex items-start gap-2 rounded-t-lg border border-b-0 px-4 py-2.5 text-left transition-colors ${
                active
                  ? "border-slate-200 bg-white text-sky-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span
                className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-1 ${
                  active
                    ? "bg-sky-50 text-sky-600 ring-sky-100"
                    : "bg-slate-100 text-slate-500 ring-slate-200"
                }`}
              >
                <Icon size={14} aria-hidden />
              </span>
              <span>
                <span className="block text-xs font-semibold">{item.label}</span>
                <span className="block text-[10px] text-slate-400">{item.hint}</span>
              </span>
              {active && (
                <motion.span
                  layoutId="reservaciones-tab-underline"
                  className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-sky-500"
                />
              )}
            </button>
          )
        })}
      </div>

      {tab === "reservaciones" ? <ReservacionesList /> : <ContadoresMain embedded />}
    </motion.div>
  )
}

export default ReservacionesMain
