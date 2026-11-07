import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { formControlClass, formControlErrorClass, formFieldStackClass, formLabelClass } from './formControlStyles';

interface SimpleInputProps {
  label?: string;
  value: string;
  setValue: (val: string) => void;
  error?: string;
  setError?: (val: string) => void;
  horizontal?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: string;
  suffix?: ReactNode;
  /** When set, renders a textarea instead of a single-line input. */
  rows?: number;
}

const shakeAnimation = {
  initial: { x: 0 },
  animate: { x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } },
};

const SimpleInput = ({
  label,
  value,
  setValue,
  error,
  setError,
  horizontal = false,
  required = false,
  fullWidth = false,
  disabled,
  type = 'text',
  suffix,
  rows,
}: SimpleInputProps) => {
  const fieldClassName = `${rows ? 'min-h-[5rem] h-auto resize-y py-2.5' : formControlClass} ${
    error ? formControlErrorClass : ''
  } ${disabled ? 'cursor-not-allowed bg-slate-50 text-slate-400' : ''}`

  return (
    <div
      className={
        horizontal
          ? 'grid w-full grid-cols-3 items-center gap-3'
          : formFieldStackClass
      }
    >
      {label && (
        <label className={formLabelClass}>
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

        <div className={`${horizontal ? 'col-span-2' : 'w-full'}`}>
            <div className='flex w-full items-center gap-2'>
                {rows ? (
                  <motion.textarea
                    {...(error ? shakeAnimation : {})}
                    value={value}
                    disabled={disabled}
                    rows={rows}
                    onChange={(e) => {
                      setError && setError('')
                      setValue(e.target.value)
                    }}
                    placeholder={label}
                    className={fieldClassName}
                  />
                ) : (
                  <motion.input
                    {...(error ? shakeAnimation : {})}
                    type={type}
                    value={value}
                    disabled={disabled}
                    onChange={(e) => {
                      setError && setError('')
                      setValue(e.target.value)
                    }}
                    placeholder={label}
                    className={fieldClassName}
                  />
                )}
                {suffix}
            </div>
            {error && (
                <motion.div
                    className="mt-1 text-xs text-red-500"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    >
                    {error}
                </motion.div>
            )}
        </div>
    </div>
  );
};

export default SimpleInput;
