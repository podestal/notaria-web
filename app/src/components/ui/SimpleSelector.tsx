import { motion } from "framer-motion";
import { useEffect } from "react";



interface Item {
    value: number;
    label: string;
}

interface Props {
    options: Item[];
    defaultValue?: number;
    setter: (value: number) => void;
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

const SimpleSelector = ({
    options,
    defaultValue,
    setter,
    label,
    required = false,
    error,
    setError,
    disabled = false,
}: Props) => {

    useEffect(() => {
        if (defaultValue !== undefined) {
            setter(defaultValue);
        }
    }, [defaultValue]);

  return (
    <div className="flex flex-col gap-2">
        {label ? (
        <div className="grid w-full grid-cols-3 items-center gap-2">
            <p className="block pl-2 text-xs font-semibold text-slate-700">{label}</p>
            <div className="col-span-2 flex w-full items-center gap-1">
                <motion.select 
                    {...(error ? shakeAnimation : {})}
                    defaultValue={defaultValue ? defaultValue.toString() : '0'}
                    value={defaultValue !== undefined ? defaultValue?.toString() : '0'}
                    disabled={disabled}
                    onChange={(e) => {
                        setError?.('');
                        setter(parseInt(e.target.value));
                    }}
                    className={`w-full flex-1 rounded-md border bg-white px-2 py-2 text-slate-700 ${
                        error ? 'border-red-500 focus:ring-red-300' : 'border-slate-300 focus:ring-blue-300'
                    } focus:outline-none focus:ring-2 ${disabled ? 'cursor-not-allowed bg-slate-100 text-slate-500' : ''}`}
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
        ) : (
        <div className="flex w-full items-center gap-1">
            <motion.select
                {...(error ? shakeAnimation : {})}
                defaultValue={defaultValue ? defaultValue.toString() : '0'}
                value={defaultValue !== undefined ? defaultValue?.toString() : '0'}
                disabled={disabled}
                onChange={(e) => {
                    setError?.('');
                    setter(parseInt(e.target.value));
                }}
                className={`w-full rounded-md border bg-white px-2 py-2 text-slate-700 ${
                    error ? 'border-red-500 focus:ring-red-300' : 'border-slate-300 focus:ring-blue-300'
                } focus:outline-none focus:ring-2 ${disabled ? 'cursor-not-allowed bg-slate-100 text-slate-500' : ''}`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </motion.select>
            {required && <span className="text-red-500">*</span>}
        </div>
        )}
        {error && (
            <motion.div
                className="mt-1 px-2 text-center text-xs text-red-500"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                >
                {error}
            </motion.div>
        )}
        </div>
  )
}

export default SimpleSelector
