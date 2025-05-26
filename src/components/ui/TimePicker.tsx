import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface Props {
  selectedTime: string | undefined;
  setSelectedTime: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const TimePicker: React.FC<Props> = ({ selectedTime, setSelectedTime }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Set current time on mount if no selectedTime
    if (!selectedTime) {
      const now = new Date();
      const formatted = now.toTimeString().slice(0, 5); // "HH:mm"
      setSelectedTime(formatted);
      setInputValue(formatted);
    } else {
      setInputValue(selectedTime);
    }
  }, [selectedTime, setSelectedTime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Optional: validate format "HH:mm"
    const isValid = /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
    if (isValid) {
      setSelectedTime(value);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 border-2 border-neutral-400 rounded-lg px-3 py-2 bg-white text-sm focus-within:border-blue-700">
        <p className='font-bold text-md'>Hora</p>
        <Clock size={16} className="text-gray-500" />
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="HH:mm"
          className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-400"
        />
      </div>
    </div>
  );
};

export default TimePicker;
