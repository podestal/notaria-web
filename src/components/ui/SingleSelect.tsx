import React from "react";

type Option = {
  value: string;
  label: string;
};

interface SingleSelectProps {
  options: Option[];
  selected: string;
  onChange: (value: string) => void;
}

const SingleSelect: React.FC<SingleSelectProps> = ({ options, selected, onChange }) => {
  return (
    <div className="flex justify-baseline items-center gap-10">
      {options.map((option) => (
        <label
          key={option.value}
          className={`flex items-center space-x-3 p-2 border rounded-lg cursor-pointer transition
            ${selected === option.value ? "bg-blue-100 border-blue-500" : "border-gray-300 hover:bg-gray-100"}`}
        >
          <input
            type="radio"
            name="single-select"
            value={option.value}
            checked={selected === option.value}
            onChange={() => onChange(option.value)}
            className="form-radio text-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default SingleSelect;