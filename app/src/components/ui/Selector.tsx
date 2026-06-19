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
}

const Selector = ({ options, defaultValue, setter, label, horizontal, smallLabel }: Props) => {

  return (
    <div className={`flex ${!horizontal && 'flex-col'} gap-2`}>
        {label != null && label !== '' && (
            <p className={`${smallLabel ? 'pl-2 block text-xs font-semibold text-slate-700' : 'text-md font-bold py-2'}`}>{label}</p>
        )}
                        <select
            defaultValue={defaultValue ? defaultValue.toString() : '0'}
            onChange={e => {
                setter(e.target.value ? parseInt(e.target.value) : 0)
            }}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100">
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
        </select>
    </div>
  )
}

export default Selector