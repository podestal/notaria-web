import getTitleCase from "../../../utils/getTitleCase"

const getTone = (status: string) => {
    const s = status.trim().toLowerCase()
    if (!s) return "bg-slate-100 text-slate-500 ring-slate-200"
    if (s.includes("fallido") || s.includes("error") || s.includes("rechaz")) return "bg-red-50 text-red-700 ring-red-200"
    if (s.includes("observ") || s.includes("pendiente")) return "bg-amber-50 text-amber-700 ring-amber-200"
    if (s.includes("sin codigo") || s.includes("sin código")) return "bg-orange-50 text-orange-700 ring-orange-200"
    if (s.startsWith("no ")) return "bg-slate-100 text-slate-600 ring-slate-200"
    if (s.includes("enviado") || s.includes("guardado")) return "bg-emerald-50 text-emerald-700 ring-emerald-200"
    return "bg-blue-50 text-blue-700 ring-blue-200"
}

const SisgenStatusBadge = ({ status }: { status: string }) => {
  return (
    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${getTone(status)}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
        {status ? getTitleCase(status) : "Sin estado"}
    </span>
  )
}

export default SisgenStatusBadge
