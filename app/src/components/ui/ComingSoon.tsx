import { motion } from "framer-motion"
import { Construction } from "lucide-react"

const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex max-w-md flex-col items-center gap-4"
        >
            <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 ring-1 ring-blue-100"
            >
                <Construction className="h-8 w-8 text-blue-600" />
            </motion.span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
                Estamos trabajando en este módulo
            </h1>
            <p className="text-sm leading-relaxed text-slate-500">
                Esta funcionalidad aún no está disponible. Pronto estará lista con la misma
                experiencia del resto de la plataforma.
            </p>
        </motion.div>
    </div>
  )
}

export default ComingSoon
