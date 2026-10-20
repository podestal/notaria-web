import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Car,
  FileSpreadsheet,
  FileText,
  Home,
  type LucideIcon,
} from "lucide-react"

const PDT_OPTIONS: {
  name: string
  path: string
  icon: LucideIcon
  surface: string
  glow: string
  iconWrap: string
  arrow: string
}[] = [
  {
    name: "Escrituras",
    path: "/app/reportes/archivos-pdt/escrituras",
    icon: FileText,
    surface: "from-sky-500/15 via-sky-500/5 to-transparent",
    glow: "bg-sky-400/30",
    iconWrap: "bg-sky-500/15 text-sky-600 ring-sky-500/20",
    arrow: "text-sky-500/50 group-hover:text-sky-600",
  },
  {
    name: "Garantías",
    path: "/app/reportes/archivos-pdt/garantias",
    icon: Home,
    surface: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    glow: "bg-emerald-400/30",
    iconWrap: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20",
    arrow: "text-emerald-500/50 group-hover:text-emerald-600",
  },
  {
    name: "Vehiculares",
    path: "/app/reportes/archivos-pdt/vehiculares",
    icon: Car,
    surface: "from-amber-500/15 via-amber-500/5 to-transparent",
    glow: "bg-amber-400/30",
    iconWrap: "bg-amber-500/15 text-amber-600 ring-amber-500/20",
    arrow: "text-amber-500/50 group-hover:text-amber-600",
  },
  {
    name: "Libros",
    path: "/app/reportes/archivos-pdt/libros",
    icon: BookOpen,
    surface: "from-violet-500/15 via-violet-500/5 to-transparent",
    glow: "bg-violet-400/30",
    iconWrap: "bg-violet-500/15 text-violet-600 ring-violet-500/20",
    arrow: "text-violet-500/50 group-hover:text-violet-600",
  },
  {
    name: "Mis errores PDT",
    path: "/app/reportes/archivos-pdt/mis-errores",
    icon: AlertTriangle,
    surface: "from-rose-500/15 via-rose-500/5 to-transparent",
    glow: "bg-rose-400/30",
    iconWrap: "bg-rose-500/15 text-rose-600 ring-rose-500/20",
    arrow: "text-rose-500/50 group-hover:text-rose-600",
  },
]

const ArchivosPdtHub = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto mb-10 mt-4 w-[92%] max-w-[1400px] text-slate-800"
    >
      <div className="keep-dark relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-8 text-slate-100 sm:px-8">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.8, 0.45] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 left-1/4 h-52 w-52 rounded-full bg-sky-500/20 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.7, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 16 }}
              className="rounded-2xl bg-emerald-500/15 p-3 ring-1 ring-emerald-400/25"
            >
              <FileSpreadsheet className="h-6 w-6 text-emerald-300" aria-hidden />
            </motion.div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-300/90">
                Reportes
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Archivos PDT
              </h1>
              <p className="mt-1.5 max-w-lg text-sm text-slate-400">
                Elija el tipo de archivo PDT o use el menú lateral para ir directo.
              </p>
            </div>
          </div>
          <p className="text-xs tabular-nums text-slate-500">
            {PDT_OPTIONS.length} reportes
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 lg:grid-cols-3">
        {PDT_OPTIONS.map((option, index) => {
          const Icon = option.icon
          return (
            <motion.div
              key={option.path}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.06 + index * 0.05, ease: "easeOut" }}
            >
              <Link
                to={option.path}
                className="group relative block h-full cursor-pointer overflow-hidden rounded-2xl bg-white/70 p-5 shadow-[0_1px_0_rgba(15,23,42,0.04)] outline-none transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] focus-visible:ring-2 focus-visible:ring-emerald-400/50"
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${option.surface}`}
                />
                <div
                  aria-hidden
                  className={`pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full blur-2xl ${option.glow}`}
                />
                <div className="relative flex h-full flex-col gap-5">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 backdrop-blur-sm transition duration-300 group-hover:scale-105 ${option.iconWrap}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/50 transition duration-300 group-hover:translate-x-0.5 ${option.arrow}`}
                    >
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                  <h2 className="mt-auto text-base font-semibold tracking-tight text-slate-900">
                    {option.name}
                  </h2>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

export default ArchivosPdtHub
