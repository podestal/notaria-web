import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

interface Option {
  id: string;
  label: string;
}

interface Props {
  options: Option[];
  selected: Option | null;
  setSelected: React.Dispatch<React.SetStateAction<Option | null>>;
  onInputChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  error?: string;
  setError?: (val: string) => void;
  /** When true, the user must pick an option from the list before they can freely edit the text. */
  requireSelectionFirst?: boolean;
  /** Message shown (in Spanish) when the user types without having selected an option first. */
  requireSelectionMessage?: string;
}

const shakeAnimation = {
  initial: { x: 0 },
  animate: { x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } },
};

const SearchableDropdownInput: React.FC<Props> = ({
  options,
  selected,
  setSelected,
  onInputChange,
  placeholder,
  required,
  defaultValue,
  error,
  setError,
  requireSelectionFirst,
  requireSelectionMessage,
}) => {
  const [inputValue, setInputValue] = useState(selected?.label || defaultValue || '');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) {
      setInputValue(selected.label);
      onInputChange?.(selected.label);
    }
  }, [selected, onInputChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = options.filter((opt) =>
    opt.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (option: Option) => {
    setSelected(option);
    setInputValue(option.label);
    setOpen(false);
    setError?.(''); // clear error when an option is selected
  };

  return (
    <div className="relative w-full my-4" ref={wrapperRef}>
      <div className="flex items-center w-full gap-2">
        <motion.input
          {...(error ? shakeAnimation : {})}
          ref={inputRef}
          type="text"
          placeholder={placeholder || 'Select an option'}
          className={`w-full bg-white text-slate-900 border rounded-md py-2 px-3 focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-500 focus:ring-red-300'
              : 'border-slate-300 focus:ring-blue-300'
          }`}
          value={inputValue}
          onFocus={() => {
            setOpen(true);
            // Keep reminding the user to pick from the list if they already have
            // text but never actually selected a valid option.
            if (requireSelectionFirst && !selected && inputValue.trim()) {
              setError?.(
                requireSelectionMessage ||
                  'Debe seleccionar una opción de la lista primero'
              );
            } else {
              setError?.('');
            }
          }}
          onChange={(e) => {
            const nextValue = e.target.value;
            setInputValue(nextValue);
            onInputChange?.(nextValue);
            setOpen(true);
            // If the user clears the field, drop the previous selection so an empty
            // field can never be saved with a stale (previously picked) value.
            if (requireSelectionFirst && !nextValue.trim() && selected) {
              setSelected(null);
            }
            // The user must pick an option from the list before the value is valid.
            // We still let them type (to search/filter and keep the field in sync),
            // but we keep warning them until a real selection is made — this applies
            // both when creating and when editing an existing record.
            if (requireSelectionFirst && (!selected || !nextValue.trim())) {
              setError?.(
                requireSelectionMessage ||
                  'Debe seleccionar una opción de la lista primero'
              );
            } else {
              setError?.('');
            }
          }}
        />
        {required && <span className="text-red-500">*</span>}
      </div>
      {error && (
        <div className="text-xs text-red-500 mt-1 px-2">{error}</div>
      )}
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-2 text-sm text-black">No results found</div>
          ) : (
            filtered.map((option) => (
              <div
                key={option.id}
                className="px-4 py-2 text-sm text-black cursor-pointer hover:bg-blue-100"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdownInput;
