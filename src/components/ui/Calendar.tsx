import React, { useEffect, useRef, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import 'react-day-picker/dist/style.css';
// import { RiCalendar2Fill } from '@remixicon/react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { es } from "react-day-picker/locale";

interface Props {
  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

const Calendar: React.FC<Props> = ({ selectedDate, setSelectedDate }) => {
  const [open, setOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement | null>(null);

  // Spanish month names mapping
  const spanishMonths = {
    0: 'Enero',
    1: 'Febrero', 
    2: 'Marzo',
    3: 'Abril',
    4: 'Mayo',
    5: 'Junio',
    6: 'Julio',
    7: 'Agosto',
    8: 'Septiembre',
    9: 'Octubre',
    10: 'Noviembre',
    11: 'Diciembre'
  };

  // Spanish day names mapping
  const spanishDays = {
    0: 'Dom',
    1: 'Lun', 
    2: 'Mar',
    3: 'Mié',
    4: 'Jue',
    5: 'Vie',
    6: 'Sáb'
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative my-auto w-56">
      <p
        className="flex justify-center items-center gap-6 cursor-pointer text-center bg-white border-neutral-400 border-2 rounded-lg w-full text-xs px-2 py-2 focus:border-blue-700 focus:outline-none"
        onClick={() => setOpen(true)}
      >
        <span className="font-bold"></span>{' '}
        {selectedDate ? moment(selectedDate).format('DD-MM-YYYY') : 'Seleccione Fecha'}
        <CalendarIcon />
      </p>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={calendarRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 right-10 transform -translate-x-[-10%] z-50 p-4 bg-white text-black rounded-xl shadow-lg"
          >
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={es}
              captionLayout="dropdown"
              formatters={{
                formatCaption: (date) => {
                  const month = spanishMonths[date.getMonth() as keyof typeof spanishMonths];
                  const year = date.getFullYear();
                  return `${month} ${year}`;
                },
                formatWeekdayName: (day) => {
                  return spanishDays[day as unknown as keyof typeof spanishDays];
                }
              }}
              styles={{
                caption: { color: 'black' },
                head: { color: 'black' },
                cell: { color: 'black' },
              }}
              className="!text-black"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;