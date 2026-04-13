import { motion } from 'framer-motion';

interface DateInputProps {
  label?: string;
  value: string;
  setValue: (val: string) => void;
  error?: string;
  setError?: (val: string) => void;
  required?: boolean;
  horizontal?: boolean;
}

const shakeAnimation = {
  initial: { x: 0 },
  animate: { x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } },
};

// Format raw input like "14081976" into "14/08/1976"
const formatDate = (input: string): string => {
    const digits = input.replace(/\D/g, '').slice(0, 8); // Remove non-digit characters and limit to 8 digits
    const parts = [];
  
    if (digits.length > 0) parts.push(digits.slice(0, Math.min(2, digits.length))); // Add day (handles less than 2 digits)
    if (digits.length > 2) parts.push(digits.slice(2, Math.min(4, digits.length))); // Add month (handles less than 4 digits)
    if (digits.length > 4) parts.push(digits.slice(4)); // Add year
  
    return parts.join('/'); // Join parts with '/'
  };

const DateInput = ({
  label,
  value,
  setValue,
  error,
  setError,
  required = false,
  horizontal = false,
}: DateInputProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.currentTarget.value; // Get the raw input value
        const formatted = formatDate(input); // Format the input value
        // Ensure the formatted value is valid before updating the state
        if (formatted.length <= 10) {
          setError?.(''); // Clear any existing error
          setValue(formatted); // Update the state with the formatted value
        } else {
          setError?.('Invalid date format'); // Set an error if the input is invalid
        }
      };

  return (
    <div className={`flex w-full ${horizontal ? 'grid grid-cols-3 items-center' : 'flex-col justify-center items-start'} gap-6`}>
      {label && (
        <label className="pl-1 text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <motion.input
        {...(error ? shakeAnimation : {})}
        type="text"
        inputMode="numeric"
        maxLength={10}
        placeholder="DD/MM/AAAA"
        value={value}
        onChange={handleChange}
        className={`col-span-2 bg-white text-slate-700 border ${
          error ? 'border-red-500' : 'border-slate-300'
        } rounded-md py-2 px-3 focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-300' : 'focus:ring-blue-300'
        }`}
      />
      {error && (
        <motion.div
          className="text-xs text-red-500 mt-1 px-1"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default DateInput;
