interface Item {
    value: number;
    label: string;
}

interface Props {
    options: Item[]
    setter: (value: number) => void;
}

const Selector = ({ options, setter }: Props) => {
  return (
    <select 
    onChange={e => {
        setter(e.target.value ? parseInt(e.target.value) : 0)
    }}
    className="bg-white text-slate-700 border border-slate-300 rounded-md p-2">
        {options.map((option) => (
            <option key={option.value} value={option.value}>
                {option.label}
            </option>
        ))}
    </select>
  )
}

export default Selector