import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  ArrowRight,
  BookOpen,
  Car,
  FileText,
  Home,
  LibraryBig,
  Scale,
  type LucideIcon,
} from "lucide-react"
import useKardexTypesStore from "../../../hooks/store/useKardexTypesStore"
import useBodyRenderStore from "../../../hooks/store/bodyRenderStore"
import useKardexFiltersStore from "../../../hooks/store/useKardexFiltersStore"
import useCorrelativeStore from "../../../hooks/store/useCorrelativeStore"
import getTitleCase from "../../../utils/getTitleCase"

const TIPOKAR_META: Record<
  number,
  {
    icon: LucideIcon
    surface: string
    glow: string
    iconWrap: string
    arrow: string
  }
> = {
  1: {
    icon: FileText,
    surface: "from-sky-500/15 via-sky-500/5 to-transparent",
    glow: "bg-sky-400/30",
    iconWrap: "bg-sky-500/15 text-sky-600 ring-sky-500/20",
    arrow: "text-sky-500/50 group-hover:text-sky-600",
  },
  2: {
    icon: Scale,
    surface: "from-violet-500/15 via-violet-500/5 to-transparent",
    glow: "bg-violet-400/30",
    iconWrap: "bg-violet-500/15 text-violet-600 ring-violet-500/20",
    arrow: "text-violet-500/50 group-hover:text-violet-600",
  },
  3: {
    icon: Car,
    surface: "from-amber-500/15 via-amber-500/5 to-transparent",
    glow: "bg-amber-400/30",
    iconWrap: "bg-amber-500/15 text-amber-600 ring-amber-500/20",
    arrow: "text-amber-500/50 group-hover:text-amber-600",
  },
  4: {
    icon: Home,
    surface: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    glow: "bg-emerald-400/30",
    iconWrap: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20",
    arrow: "text-emerald-500/50 group-hover:text-emerald-600",
  },
  5: {
    icon: BookOpen,
    surface: "from-indigo-500/15 via-indigo-500/5 to-transparent",
    glow: "bg-indigo-400/30",
    iconWrap: "bg-indigo-500/15 text-indigo-600 ring-indigo-500/20",
    arrow: "text-indigo-500/50 group-hover:text-indigo-600",
  },
}

const ProtocolaresHub = () => {
  const kardexTypes = useKardexTypesStore((s) => s.kardexTypes)
  const setBodyRender = useBodyRenderStore((s) => s.setBodyRender)
  const setKardexFilter = useKardexFiltersStore((s) => s.setKardexFilter)
  const setCorrelative = useCorrelativeStore((s) => s.setCorrelative)

  const types = kardexTypes.filter((t) => t.idtipkar <= 5)

  const handleSelect = (idtipkar: number) => {
    setCorrelative("")
    setKardexFilter({ type: "", value: "" })
    setBodyRender(idtipkar)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto mb-10 mt-4 w-[92%] max-w-[1400px] overflow-hidden rounded-2xl bg-slate-100/80 text-slate-800 shadow-sm"
    >
      <div className="keep-dark relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-8 text-slate-100 sm:px-8">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-sky-500/25 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.8, 0.45] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-28 left-1/4 h-52 w-52 rounded-full bg-indigo-500/20 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.7, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 16 }}
              className="rounded-2xl bg-sky-500/15 p-3 ring-1 ring-sky-400/25"
            >
              <LibraryBig className="h-6 w-6 text-sky-300" aria-hidden />
            </motion.div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-sky-300/90">
                Protocolares
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Elija el tipo de instrumento
              </h1>
              <p className="mt-1.5 max-w-lg text-sm text-slate-400">
                Abra un módulo desde aquí, o use el menú lateral cuando ya sepa a dónde ir.
              </p>
            </div>
          </div>
          <p className="text-xs tabular-nums text-slate-500">
            {types.length} tipo{types.length === 1 ? "" : "s"} disponible
            {types.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
        {types.map((tipo, index) => {
          const meta = TIPOKAR_META[tipo.idtipkar]
          const Icon = meta?.icon ?? FileText
          return (
            <motion.div
              key={tipo.idtipkar}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.06 + index * 0.055, ease: "easeOut" }}
            >
              <Link
                to={`/app/protocolares?tipkar=${tipo.idtipkar}`}
                onClick={() => handleSelect(tipo.idtipkar)}
                className="group relative block h-full cursor-pointer overflow-hidden rounded-2xl bg-white/70 p-5 shadow-[0_1px_0_rgba(15,23,42,0.04)] outline-none transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] focus-visible:ring-2 focus-visible:ring-sky-400/50"
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${
                    meta?.surface ?? "from-sky-500/15 via-sky-500/5 to-transparent"
                  }`}
                />
                <motion.div
                  aria-hidden
                  className={`pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full blur-2xl ${
                    meta?.glow ?? "bg-sky-400/30"
                  }`}
                  initial={{ opacity: 0.35, scale: 0.9 }}
                  whileHover={{ opacity: 0.75, scale: 1.15 }}
                  transition={{ duration: 0.35 }}
                />

                <div className="relative flex h-full flex-col gap-5">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ring-1 backdrop-blur-sm transition duration-300 group-hover:scale-105 ${
                        meta?.iconWrap ?? "bg-sky-500/15 text-sky-600 ring-sky-500/20"
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/50 transition duration-300 group-hover:translate-x-0.5 ${
                        meta?.arrow ?? "text-sky-500/50 group-hover:text-sky-600"
                      }`}
                    >
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>

                  <div className="mt-auto">
                    <h2 className="text-base font-semibold tracking-tight text-slate-900">
                      {getTitleCase(tipo.nomtipkar)}
                    </h2>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {types.length === 0 && (
        <p className="px-6 pb-10 text-center text-sm text-slate-500">
          No hay tipos de kardex disponibles.
        </p>
      )}
    </motion.div>
  )
}

export default ProtocolaresHub
