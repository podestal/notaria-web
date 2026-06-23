import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { DayPicker } from "react-day-picker"
import { motion, AnimatePresence } from "framer-motion"
import moment from "moment"
import "react-day-picker/dist/style.css"
import { Calendar as CalendarIcon } from "lucide-react"
import { es } from "react-day-picker/locale"

interface Props {
    selectedDate: Date | undefined
    setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>
    fullWidth?: boolean
}

const POPUP_WIDTH = 320
const POPUP_HEIGHT = 380
const VIEWPORT_PADDING = 12

const spanishMonths = {
    0: "Enero",
    1: "Febrero",
    2: "Marzo",
    3: "Abril",
    4: "Mayo",
    5: "Junio",
    6: "Julio",
    7: "Agosto",
    8: "Septiembre",
    9: "Octubre",
    10: "Noviembre",
    11: "Diciembre",
}

const spanishDays = {
    0: "Dom",
    1: "Lun",
    2: "Mar",
    3: "Mié",
    4: "Jue",
    5: "Vie",
    6: "Sáb",
}

const getPopupPosition = (trigger: HTMLElement) => {
    const rect = trigger.getBoundingClientRect()
    let top = rect.bottom + 8
    let left = rect.left

    if (top + POPUP_HEIGHT > window.innerHeight - VIEWPORT_PADDING) {
        top = Math.max(VIEWPORT_PADDING, rect.top - POPUP_HEIGHT - 8)
    }

    if (left + POPUP_WIDTH > window.innerWidth - VIEWPORT_PADDING) {
        left = window.innerWidth - POPUP_WIDTH - VIEWPORT_PADDING
    }

    if (left < VIEWPORT_PADDING) {
        left = VIEWPORT_PADDING
    }

    return { top, left }
}

const Calendar: React.FC<Props> = ({ selectedDate, setSelectedDate, fullWidth = false }) => {
    const [open, setOpen] = useState(false)
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 })
    const triggerRef = useRef<HTMLButtonElement | null>(null)
    const calendarRef = useRef<HTMLDivElement | null>(null)

    const openCalendar = () => {
        if (triggerRef.current) {
            setPopupPosition(getPopupPosition(triggerRef.current))
        }
        setOpen(true)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node
            if (
                calendarRef.current?.contains(target) ||
                triggerRef.current?.contains(target)
            ) {
                return
            }
            setOpen(false)
        }

        const handleReposition = () => {
            if (!open || !triggerRef.current) return
            setPopupPosition(getPopupPosition(triggerRef.current))
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside)
            window.addEventListener("resize", handleReposition)
            window.addEventListener("scroll", handleReposition, true)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            window.removeEventListener("resize", handleReposition)
            window.removeEventListener("scroll", handleReposition, true)
        }
    }, [open])

    const popup = (
        <AnimatePresence>
            {open && (
                <motion.div
                    ref={calendarRef}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="fixed z-[200] max-h-[min(24rem,calc(100vh-1.5rem))] overflow-y-auto rounded-xl bg-white p-4 text-black shadow-xl ring-1 ring-slate-200"
                    style={{
                        top: popupPosition.top,
                        left: popupPosition.left,
                        width: POPUP_WIDTH,
                        ["--rdp-accent-color" as string]: "#2563eb",
                        ["--rdp-accent-background-color" as string]: "#dbeafe",
                    }}
                >
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                            setSelectedDate(date)
                            setOpen(false)
                        }}
                        locale={es}
                        captionLayout="dropdown"
                        formatters={{
                            formatCaption: (date) => {
                                const month = spanishMonths[date.getMonth() as keyof typeof spanishMonths]
                                return `${month} ${date.getFullYear()}`
                            },
                            formatWeekdayName: (day) =>
                                spanishDays[day as unknown as keyof typeof spanishDays],
                        }}
                        styles={{
                            caption: { color: "black" },
                            caption_label: { color: "black" },
                            dropdown: { color: "black", backgroundColor: "white" },
                            dropdown_root: { color: "black" },
                            dropdowns: { color: "black" },
                            head: { color: "black" },
                            head_cell: { color: "black" },
                            cell: { color: "black" },
                            day: { color: "black" },
                            day_button: { color: "black" },
                            selected: { color: "#ffffff", backgroundColor: "#2563eb" },
                            today: { color: "#0f172a", fontWeight: 700 },
                            outside: { color: "#64748b" },
                            button_next: { color: "black" },
                            button_previous: { color: "black" },
                            nav: { color: "black" },
                        }}
                        className="!text-black [&_.rdp-day_button]:!text-slate-900 [&_.rdp-selected_.rdp-day_button]:!text-white"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )

    return (
        <div className={`relative my-auto ${fullWidth ? "w-full" : "w-56"}`}>
            <button
                ref={triggerRef}
                type="button"
                className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                onClick={openCalendar}
            >
                <span className="font-medium">
                    {selectedDate && !Number.isNaN(selectedDate.getTime())
                        ? moment(selectedDate).format("DD-MM-YYYY")
                        : "Seleccione fecha"}
                </span>
                <CalendarIcon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
            </button>
            {typeof document !== "undefined" ? createPortal(popup, document.body) : null}
        </div>
    )
}

export default Calendar
