import { EXTRA_FILTER_INPUT_CLASS } from "../../ExtraFiltersShell"

interface Props {
    description: string
    setDescription: (description: string) => void
}

const SellosFilter = ({
    description,
    setDescription,
}: Props) => {
  return (
    <div className="w-full border-b border-slate-200 bg-slate-50/70 px-4 py-3">
        <p className="mb-2 text-xs font-semibold text-slate-700">Filtrar sellos</p>
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 transition-shadow focus-within:border-sky-300 focus-within:shadow-md focus-within:shadow-sky-100">
            <p className="min-w-[5.5rem] shrink-0 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Descripción
            </p>
            <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Buscar por descripción…"
                className={EXTRA_FILTER_INPUT_CLASS}
            />
        </div>
    </div>
  )
}

export default SellosFilter
