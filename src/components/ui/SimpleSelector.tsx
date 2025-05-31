interface Item {
    value: number;
    label: string;
}

interface Props {
    options: Item[]
    defaultValue?: number;
    setter: (value: number) => void;
    label?: string
    horizontal?: boolean
    smallLabel?: boolean;
    required?: boolean;
}

const SimpleSelector = ({
    options,
    defaultValue,
    setter,
    label,
    required = false,
}: Props) => {
  return (
    <div className="grid grid-cols-3 items-center gap-2">
        <p className="pl-2 block text-xs font-semibold text-slate-700">{label}</p>
        <div className="flex items-center gap-1 w-full">
            <select 
                defaultValue={defaultValue ? defaultValue.toString() : '0'}
                onChange={e => {
                    setter(e.target.value ? parseInt(e.target.value) : 0)
                }}
                className="flex-1 bg-white w-2xl col-span-2 text-slate-700 border border-slate-300 rounded-md py-2  px-2">
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
            </select>
            {required && <span className="text-red-500">*</span>}
        </div>
    </div>
  )
}

export default SimpleSelector