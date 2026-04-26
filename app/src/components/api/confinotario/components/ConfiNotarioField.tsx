interface ConfiNotarioFieldProps {
  label: string
  value: string
  placeholder?: string
  required?: boolean
  type?: string
  onChange: (value: string) => void
}

const ConfiNotarioField = ({
  label,
  value,
  placeholder,
  required,
  type = "text",
  onChange,
}: ConfiNotarioFieldProps) => {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
      />
    </label>
  )
}

export default ConfiNotarioField
