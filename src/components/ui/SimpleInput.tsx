interface Props {
    value: string
    setValue: (value: string) => void
    label?: string 
    horizontal?: boolean
}

const SimpleInput = ({ value, setValue, label, horizontal }: Props) => {
  return (
    <div className={`flex w-full ${horizontal ? 'flex-row justify-baseline items-center' : 'flex-col justify-center items-start'} gap-6`}>
        {label && <label className="pl-2 block text-xs font-semibold text-slate-700 mb-2">{label}</label>}
        <input 
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={label}
            className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
        />
    </div>
  )
}

export default SimpleInput