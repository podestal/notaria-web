interface Item {
    value: number;
    label: string;
}

interface Props {
    options: Item[]
    setter: (value: number) => void;
    label?: string
    horizontal?: boolean
}

const Selector = ({ options, setter, label, horizontal }: Props) => {
  return (
    <div className={`flex ${!horizontal && 'flex-col'} gap-2`}>
        <p className="text-md font-bold py-2">{label}</p>
        <select 
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