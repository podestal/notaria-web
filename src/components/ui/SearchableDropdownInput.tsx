import React, { useEffect, useRef, useState } from 'react';

interface Option {
  id: string;
  label: string;
}

interface Props {
  options: Option[];
  selected: Option | null;
  setSelected: React.Dispatch<React.SetStateAction<Option | null>>;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
}

const SearchableDropdownInput: React.FC<Props> = ({ options, selected, setSelected, placeholder, required, defaultValue }) => {
  const [inputValue, setInputValue] = useState(selected?.label || defaultValue || '');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) {
      setInputValue(selected.label);
    }
  }, [selected]);

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
  };

  return (
    <div className="relative w-full my-4" ref={wrapperRef}>
      <div className='flex items-center w-full gap-2'>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder || 'Select an option'}
          className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
          value={inputValue}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setInputValue(e.target.value);
            setOpen(true);
          }}
        />
        {required && <span className="text-red-500">*</span>}
      </div>
      {open && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">No results found</div>
          ) : (
            filtered.map((option) => (
              <div
                key={option.id}
                className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-100"
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
