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
  fullWidth?: boolean;
}

const Calendar: React.FC<Props> = ({ selectedDate, setSelectedDate, fullWidth = false }) => {
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
    <div className={`relative my-auto ${fullWidth ? "w-full" : "w-56"}`}>
      <p
        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
        onClick={() => setOpen(true)}
      >
        <span className="font-medium">
        {selectedDate && !Number.isNaN(selectedDate.getTime())
            ? moment(selectedDate).format('DD-MM-YYYY')
            : 'Seleccione fecha'}
        </span>
        <CalendarIcon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
      </p>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={calendarRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 right-10 z-50 -translate-x-[-10%] rounded-xl bg-white p-4 text-black shadow-lg"
            style={
              {
                // Force deterministic DayPicker colors regardless of parent theme.
                ["--rdp-accent-color" as string]: "#2563eb",
                ["--rdp-accent-background-color" as string]: "#dbeafe",
              } as React.CSSProperties
            }
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
                caption_label: { color: 'black' },
                dropdown: { color: 'black', backgroundColor: 'white' },
                dropdown_root: { color: 'black' },
                dropdowns: { color: 'black' },
                head: { color: 'black' },
                head_cell: { color: 'black' },
                cell: { color: 'black' },
                day: { color: 'black' },
                day_button: { color: 'black' },
                selected: { color: '#ffffff', backgroundColor: '#2563eb' },
                today: { color: '#0f172a', fontWeight: 700 },
                outside: { color: '#64748b' },
                button_next: { color: 'black' },
                button_previous: { color: 'black' },
                nav: { color: 'black' },
              }}
              className="!text-black [&_.rdp-day_button]:!text-slate-900 [&_.rdp-selected_.rdp-day_button]:!text-white"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;