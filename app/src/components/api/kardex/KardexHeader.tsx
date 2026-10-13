import { motion } from "framer-motion"
import { LibraryBig, Search } from "lucide-react"
import CreateKardex from "./CreateKardex"

const KardexHeader = () => {
  return (
    <div className="keep-dark relative w-full overflow-hidden flex justify-between items-center bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 text-slate-50">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-10 -top-16 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl"
          animate={{ x: [0, 30, 0], opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative flex items-center gap-3">
          <motion.div
            initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            whileHover={{ rotate: -6, scale: 1.05 }}
            className="rounded-xl bg-sky-500/15 p-2 border border-sky-400/30"
          >
          <LibraryBig 
            className="text-sky-300"
          />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <p className="text-[10px] uppercase tracking-[0.16em] text-sky-300/90">Módulo</p>
            <h2 className="text-lg font-semibold text-white">Instrumentos Protocolares</h2>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          className="relative flex justify-center items-center gap-4 text-sm"
        >
            <CreateKardex />
            <div className="h-8 w-px bg-slate-600" />
            <div className="flex items-center gap-2 rounded-lg border border-slate-600 bg-slate-800/70 px-3 py-2 text-slate-200">
            <Search 
              size={16}
              className="text-sky-300"
            />
            <p className="text-xs font-semibold">Kardex</p>
            </div>
        </motion.div>
    </div>
  )
}

export default KardexHeader
