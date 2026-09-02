import React from "react";

type Option = {
  value: string;
  label: string;
};

interface SingleSelectProps {
    options: Option[];
    selected: string;
    onChange: (value: string) => void;
    /** Fires on every click (including re-selecting the current option). */
    onSelect?: (value: string) => void;
    disabled?: boolean;
    name?: string; // Add name prop to make each radio group unique
    /** Tighter spacing between Si/No options */
    compact?: boolean;
}

const SingleSelect: React.FC<SingleSelectProps> = ({ options, selected, onChange, onSelect, disabled, name='single-select', compact = false }) => {
  const handleSelect = (value: string) => {
    if (disabled) return
    onChange(value)
    onSelect?.(value)
  }

  return (
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-10'}`}>
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 transition
            ${selected === option.value ? "border-sky-500 bg-sky-50 ring-1 ring-sky-200" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <input
            type="radio"
            name={name} // Use the unique name prop
            value={option.value}
            checked={selected === option.value}
            onChange={() => handleSelect(option.value)}
            onClick={() => handleSelect(option.value)}
            className="form-radio text-blue-600"
            disabled={disabled}
          />
          <span className="text-sm font-medium text-slate-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default SingleSelect;