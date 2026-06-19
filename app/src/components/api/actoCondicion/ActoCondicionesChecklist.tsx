import { Check } from "lucide-react"

interface Option {
    id: string
    label: string
}

interface Props {
    options: Option[]
    selectedIds: string[]
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}

const ActoCondicionesChecklist = ({ options, selectedIds, setSelectedIds }: Props) => {
    const toggleOption = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    const selectedOptions = options.filter((option) => selectedIds.includes(option.id))

    return (
        <div className="space-y-3">
            {selectedOptions.length > 0 && (
                <div className="rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2.5">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                        Seleccionadas
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {selectedOptions.map((option) => (
                            <span
                                key={option.id}
                                className="inline-flex max-w-full items-center gap-1 rounded-full border border-blue-200 bg-white px-2.5 py-1 text-xs text-blue-900"
                            >
                                <Check className="h-3 w-3 shrink-0 text-blue-600" aria-hidden />
                                <span className="truncate">{option.label}</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid gap-2 sm:grid-cols-2">
                {options.map((option) => {
                    const isSelected = selectedIds.includes(option.id)

                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => toggleOption(option.id)}
                            className={`flex items-start gap-3 rounded-lg border p-3 text-left text-sm transition-all ${
                                isSelected
                                    ? "border-blue-300 bg-blue-50 text-blue-950 shadow-sm ring-1 ring-blue-100"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                        >
                            <span
                                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                                    isSelected
                                        ? "border-blue-600 bg-blue-600 text-white"
                                        : "border-slate-300 bg-white"
                                }`}
                            >
                                {isSelected && <Check className="h-3 w-3" strokeWidth={3} aria-hidden />}
                            </span>
                            <span className="leading-snug">{option.label}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default ActoCondicionesChecklist
