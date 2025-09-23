import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Item {
    value: string;
    label: string;
}

interface Props {
    options: Item[];
    defaultValue?: string;
    setter: (value: string) => void;
    label?: string;
    horizontal?: boolean;
    smallLabel?: boolean;
    required?: boolean;
    error?: string;
    setError?: (val: string) => void;
    disabled?: boolean;
  }


const shakeAnimation = {
    initial: { x: 0 },
    animate: { x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } },
};

const SimpleSelectorStr = ({
    options,
    defaultValue,
    setter,
    label,
    required = false,
    error,
    setError,
    disabled = false,
}: Props) => {

    const [value, setValue] = useState<string>(defaultValue ?? '');

    useEffect(() => {
        if (defaultValue) {
            setValue(defaultValue);
        }
    }, [defaultValue]);

  return (
    <div className="grid grid-cols-3 items-center gap-2 w-full">
        <p className="pl-2 block text-xs font-semibold text-slate-700">{label}</p>
        <div className="flex items-center gap-1 w-full col-span-2">
            <motion.select 
                disabled={disabled}
                {...(error ? shakeAnimation : {})}
                // defaultValue={value ? value?.toString() : '0'}
                value={value ? value?.toString() : '0'}
                onChange={(e) => {
                    setError?.('');
                    setter(e.target.value ? e.target.value : '');
                }}
                // className="flex-1 bg-white w-2xl col-span-2 text-slate-700 border border-slate-300 rounded-md py-2  px-2"
                className={`flex-1 bg-white text-slate-700 border rounded-md py-2 px-2 w-full ${
                    error ? 'border-red-500 focus:ring-red-300' : 'border-slate-300 focus:ring-blue-300'
                } focus:outline-none focus:ring-2`}
            >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
            </motion.select>
            {required && <span className="text-red-500">*</span>}
        </div>
    </div>
  )
}

export default SimpleSelectorStr
