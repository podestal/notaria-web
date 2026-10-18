import { motion } from "framer-motion"

interface ConfiNotarioFieldProps {
  label: string
  value: string
  placeholder?: string
  required?: boolean
  type?: string
  index?: number
  onChange: (value: string) => void
  className?: string
}

const ConfiNotarioField = ({
  label,
  value,
  placeholder,
  required,
  type = "text",
  index = 0,
  onChange,
  className = "",
}: ConfiNotarioFieldProps) => {
  return (
    <motion.label
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index, 12) * 0.03, ease: "easeOut" }}
      className={`flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 transition-shadow focus-within:border-sky-300 focus-within:shadow-md focus-within:shadow-sky-100 ${className}`}
    >
      <span className="min-w-[6.5rem] shrink-0 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-w-0 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
      />
    </motion.label>
  )
}

export default ConfiNotarioField
