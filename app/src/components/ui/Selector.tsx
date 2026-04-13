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
        <p className={`${smallLabel ? 'pl-2 block text-xs font-semibold text-slate-700' : 'text-md font-bold py-2'}`}>{label}</p>
        <select 
            defaultValue={defaultValue ? defaultValue.toString() : '0'}
            onChange={e => {
                setter(e.target.value ? parseInt(e.target.value) : 0)
            }}
            className="bg-white text-slate-700 border border-slate-300 rounded-md py-2  px-1">
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