import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react"

const styles = {
  notificationAnimation: `
    @keyframes slideIn {
      0% { transform: translateX(100%); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      0% { transform: translateX(0); opacity: 1; }
      100% { transform: translateX(100%); opacity: 0; }
    }
    .slide-in {
      animation: slideIn 0.5s ease forwards;
    }
    .slide-out {
      animation: slideOut 0.5s ease forwards;
    }
  `,
}

interface Props {
  type: string
  message: string
  onClose: () => void
  /** Stay until closed; no auto-dismiss timer. */
  persistent?: boolean
}

const NotificationCard = ({ type, message, onClose, persistent = false }: Props) => {
  const [animateOut, setAnimateOut] = useState(false)
  const isSuccess = type === "success"
  const isError = type === "error"
  const title = isSuccess ? "Operacion exitosa" : isError ? "Ocurrio un problema" : "Notificacion"
  const Icon = isSuccess ? CheckCircle2 : isError ? AlertCircle : Info

  useEffect(() => {
    if (persistent) return

    const timer = setTimeout(() => {
      setAnimateOut(true)
      setTimeout(() => onClose(), 500)
    }, 3200)

    return () => clearTimeout(timer)
  }, [onClose, persistent])

  const handleClose = () => {
    if (persistent) {
      onClose()
      return
    }
    setAnimateOut(true)
    setTimeout(() => onClose(), 500)
  }

  if (persistent) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 shadow-sm ${
          isSuccess
            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
            : isError
              ? "border-rose-200 bg-rose-50 text-rose-900"
              : "border-amber-200 bg-amber-50 text-amber-950"
        }`}
        role="status"
      >
        <motion.div
          initial={{ rotate: -12, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.05 }}
        >
          <Icon
            className={`mt-0.5 h-5 w-5 shrink-0 ${
              isSuccess ? "text-emerald-600" : isError ? "text-rose-600" : "text-amber-600"
            }`}
            aria-hidden
          />
        </motion.div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-5">{title}</p>
          <p className="text-sm leading-5 opacity-90">{message}</p>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="shrink-0 rounded-md p-1 text-current opacity-70 transition hover:bg-black/5 hover:opacity-100"
          aria-label="Cerrar notificación"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </motion.div>
    )
  }

  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: styles.notificationAnimation }} />

      <div
        className={`w-[360px] max-w-[calc(100vw-2rem)] rounded-xl border px-4 py-3 shadow-xl backdrop-blur-sm
        ${animateOut ? "slide-out" : "slide-in"} 
        ${isSuccess ? "border-emerald-200 bg-emerald-50/95 text-emerald-900" : isError ? "border-rose-200 bg-rose-50/95 text-rose-900" : "border-slate-200 bg-white/95 text-slate-900"}`}
      >
        <div className="flex items-start gap-3">
          <Icon
            className={`${isSuccess ? "text-emerald-600" : isError ? "text-rose-600" : "text-slate-600"} mt-0.5 h-5 w-5 shrink-0`}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-5">{title}</p>
            <p className="text-sm opacity-90 leading-5">{message}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="shrink-0 rounded-md p-1 text-current opacity-60 transition hover:bg-black/5 hover:opacity-100"
            aria-label="Cerrar notificación"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationCard
