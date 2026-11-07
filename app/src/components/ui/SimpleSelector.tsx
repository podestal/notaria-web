import { motion } from "framer-motion";
import { useEffect } from "react";
import { formControlClass, formControlErrorClass, formFieldStackClass, formLabelClass } from "./formControlStyles";

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
    horizontal = false,
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

    const selectClass = `${formControlClass} cursor-pointer ${
        error ? formControlErrorClass : ""
    } ${disabled ? "cursor-not-allowed bg-slate-50 text-slate-400" : ""}`

    const select = (
        <motion.select
            {...(error ? shakeAnimation : {})}
            value={defaultValue !== undefined ? defaultValue?.toString() : "0"}
            disabled={disabled}
            onChange={(e) => {
                setError?.("")
                setter(parseInt(e.target.value))
            }}
            className={selectClass}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </motion.select>
    )

  return (
    <div className={horizontal ? "grid w-full grid-cols-3 items-center gap-3" : formFieldStackClass}>
        {label ? (
            <>
                <p className={formLabelClass}>
                    {label}
                    {required && <span className="ml-0.5 text-red-500">*</span>}
                </p>
                <div className={horizontal ? "col-span-2 w-full" : "w-full"}>{select}</div>
            </>
        ) : (
            select
        )}
        {error && (
            <motion.div
                className="text-xs text-red-500"
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
