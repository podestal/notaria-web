import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  HeartPulse,
  Mail,
  MapPin,
  Plane,
  RefreshCw,
  ScrollText,
  Search,
  Stamp,
  UserRoundX,
  type LucideIcon,
} from "lucide-react"

type ExtraOption = {
  name: string
  path: string
  icon: LucideIcon
  available: boolean
  surface: string
  glow: string
  iconWrap: string
  arrow: string
}

const EXTRA_OPTIONS: ExtraOption[] = [
  {
    name: "Cert. Autorización de viaje",
    path: "/app/extraprotocolares/permisosViaje",
    icon: Plane,
    available: true,
    surface: "bg-gradient-to-br from-sky-500/25 via-sky-500/10 to-transparent",
    glow: "bg-sky-400/40",
    iconWrap: "bg-sky-500/20 text-sky-600 ring-sky-500/25",
    arrow: "text-sky-500/60 group-hover:text-sky-600",
  },
  {
    name: "Poderes Fuera de Registro",
    path: "/app/extraprotocolares/poderesFueraDeRegistro",
    icon: ScrollText,
    available: true,
    surface: "bg-gradient-to-br from-violet-500/25 via-violet-500/10 to-transparent",
    glow: "bg-violet-400/40",
    iconWrap: "bg-violet-500/20 text-violet-600 ring-violet-500/25",
    arrow: "text-violet-500/60 group-hover:text-violet-600",
  },
  {
    name: "Cartas Notariales",
    path: "/app/extraprotocolares/cartaNotarial",
    icon: Mail,
    available: true,
    surface: "bg-gradient-to-br from-amber-500/25 via-amber-500/10 to-transparent",
    glow: "bg-amber-400/40",
    iconWrap: "bg-amber-500/20 text-amber-600 ring-amber-500/25",
    arrow: "text-amber-500/60 group-hover:text-amber-600",
  },
  {
    name: "Cert. Apertura de Libros",
    path: "/app/extraprotocolares/aperturaLibros",
    icon: BookOpen,
    available: true,
    surface: "bg-gradient-to-br from-emerald-500/25 via-emerald-500/10 to-transparent",
    glow: "bg-emerald-400/40",
    iconWrap: "bg-emerald-500/20 text-emerald-600 ring-emerald-500/25",
    arrow: "text-emerald-500/60 group-hover:text-emerald-600",
  },
  {
    name: "Cert. Supervivencia Persona Capaz",
    path: "/app/extraprotocolares/supervivenciaCapaz",
    icon: HeartPulse,
    available: false,
    surface: "bg-gradient-to-br from-slate-400/20 via-slate-400/10 to-transparent",
    glow: "bg-slate-400/25",
    iconWrap: "bg-slate-400/15 text-slate-400 ring-slate-400/20",
    arrow: "text-slate-400/50",
  },
  {
    name: "Cert. Supervivencia Persona Incapaz",
    path: "/app/extraprotocolares/supervivenciaIncapaz",
    icon: UserRoundX,
    available: false,
    surface: "bg-gradient-to-br from-slate-400/20 via-slate-400/10 to-transparent",
    glow: "bg-slate-400/25",
    iconWrap: "bg-slate-400/15 text-slate-400 ring-slate-400/20",
    arrow: "text-slate-400/50",
  },
  {
    name: "Certificado Domiciliario",
    path: "/app/extraprotocolares/certificadoDomiciliario",
    icon: MapPin,
    available: true,
    surface: "bg-gradient-to-br from-teal-500/25 via-teal-500/10 to-transparent",
    glow: "bg-teal-400/40",
    iconWrap: "bg-teal-500/20 text-teal-600 ring-teal-500/25",
    arrow: "text-teal-500/60 group-hover:text-teal-600",
  },
  {
    name: "Cambio de Características",
    path: "/app/extraprotocolares/cambioCaracteristicas",
    icon: RefreshCw,
    available: false,
    surface: "bg-gradient-to-br from-slate-400/20 via-slate-400/10 to-transparent",
    glow: "bg-slate-400/25",
    iconWrap: "bg-slate-400/15 text-slate-400 ring-slate-400/20",
    arrow: "text-slate-400/50",
  },
  {
    name: "Busqueda Avanzada",
    path: "/app/extraprotocolares/busquedaAvanzada",
    icon: Search,
    available: false,
    surface: "bg-gradient-to-br from-slate-400/20 via-slate-400/10 to-transparent",
    glow: "bg-slate-400/25",
    iconWrap: "bg-slate-400/15 text-slate-400 ring-slate-400/20",
    arrow: "text-slate-400/50",
  },
]

const CardShell = ({ option, index }: { option: ExtraOption; index: number }) => {
  const Icon = option.icon
  const content = (
    <>
      <div aria-hidden className={`pointer-events-none absolute inset-0 ${option.surface}`} />
      <div
        aria-hidden
        className={`pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full blur-2xl ${option.glow}`}
      />
      <div className="relative flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-3">
          <span
            className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 backdrop-blur-sm transition duration-300 ${
              option.available ? "group-hover:scale-105" : ""
            } ${option.iconWrap}`}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <span
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/50 transition duration-300 ${
              option.available ? "group-hover:translate-x-0.5" : ""
            } ${option.arrow}`}
          >
            <ArrowRight className="h-4 w-4" aria-hidden />
          </span>
        </div>
        <div className="mt-auto">
          <h2
            className={`text-base font-semibold tracking-tight ${
              option.available ? "text-slate-900" : "text-slate-500"
            }`}
          >
            {option.name}
          </h2>
          {!option.available && (
            <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Próximamente
            </p>
          )}
        </div>
      </div>
    </>
  )

  const className = option.available
    ? "group relative block h-full cursor-pointer overflow-hidden rounded-2xl bg-white/70 p-5 shadow-[0_1px_0_rgba(15,23,42,0.04)] outline-none transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] focus-visible:ring-2 focus-visible:ring-amber-400/50"
    : "relative block h-full cursor-not-allowed overflow-hidden rounded-2xl bg-slate-200/50 p-5 opacity-70 grayscale"

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.06 + index * 0.045, ease: "easeOut" }}
    >
      {option.available ? (
        <Link to={option.path} className={className}>
          {content}
        </Link>
      ) : (
        <div className={className} aria-disabled="true" title="Próximamente">
          {content}
        </div>
      )}
    </motion.div>
  )
}

const ExtraprotocolaresHub = () => {
  const availableCount = EXTRA_OPTIONS.filter((o) => o.available).length

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
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.8, 0.45] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 left-1/4 h-52 w-52 rounded-full bg-violet-500/20 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.7, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 16 }}
              className="rounded-2xl bg-amber-500/15 p-3 ring-1 ring-amber-400/25"
            >
              <Stamp className="h-6 w-6 text-amber-300" aria-hidden />
            </motion.div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-300/90">
                Extraprotocolares
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Elija el tipo de trámite
              </h1>
              <p className="mt-1.5 max-w-lg text-sm text-slate-400">
                Abra un módulo desde aquí, o use el menú lateral cuando ya sepa a dónde ir.
              </p>
            </div>
          </div>
          <p className="text-xs tabular-nums text-slate-500">
            {availableCount} disponible{availableCount === 1 ? "" : "s"} ·{" "}
            {EXTRA_OPTIONS.length - availableCount} próximamente
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 lg:grid-cols-3">
        {EXTRA_OPTIONS.map((option, index) => (
          <CardShell key={option.path} option={option} index={index} />
        ))}
      </div>
    </motion.div>
  )
}

export default ExtraprotocolaresHub
