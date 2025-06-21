// components/MultiSelect.tsx

import { useRef } from 'react';
import { motion } from 'framer-motion';

interface Option {
  id: string;
  label: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  placeholder?: string;
  required?: boolean;
  label?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedIds,
  setSelectedIds,
  required = false,
  label,
}) => {

  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggleDescription = () => {
    console.log('selectedIds', selectedIds);
    
  }

  const toggleOption = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="w-full my-4" ref={wrapperRef}>
      {label && (
        <label className="text-sm font-semibold text-slate-700 mb-1 block">{label}</label>
      )}
    <div
        className="border border-slate-300 rounded-md mt-1 bg-white shadow-md max-h-60 overflow-auto"
        >
        {options.map(option => (
            <label
            key={option.id}
            className="flex items-center px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer"
            >
            <input
                type="checkbox"
                className="mr-2"
                checked={selectedIds.includes(option.id)}
              onChange={() => {
                toggleOption(option.id)
                toggleDescription()
              }}
            />
            {option.label}
            </label>
        ))}
        </div>
      {required && selectedIds.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 mt-1"
        >
          This field is required
        </motion.div>
      )}
    </div>
  );
};

export default MultiSelect;
