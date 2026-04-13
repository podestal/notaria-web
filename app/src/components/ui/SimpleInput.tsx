import { motion } from 'framer-motion';

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
  type?: string
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
  type = 'text'
}: SimpleInputProps) => {
  return (
    <div
      className={`flex w-full ${
        horizontal ? 'grid grid-cols-3 items-center' : 'flex-col justify-center items-start'
      } gap-6`}
    >
      {label && (
        <label className="pl-2 block text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}

        <div className='col-span-2'>
            <div className='flex items-center gap-2'>
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
                    className={`bg-white text-slate-700 border ${
                    fullWidth ? 'w-full' : 'min-w-64'
                    } ${
                    horizontal && 'col-span-2'
                    } ${
                    error ? 'border-red-500' : 'border-slate-300'
                    } rounded-md py-2 px-3 focus:outline-none focus:ring-2 ${
                    error ? 'focus:ring-red-300' : 'focus:ring-blue-300'
                    }
                    ${disabled ? 'cursor-not-allowed' : ''}`}
                />
                {required && <span className="text-red-500">*</span>}
                </div>
            {error && (
                <motion.div
                    className="text-xs text-red-500 mt-1 px-2"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    >
                    {error}
                </motion.div>
            )}
        </div>

      {/*  */}
    </div>
  );
};

export default SimpleInput;
