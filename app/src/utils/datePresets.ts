import moment from "moment"

export type DatePresetId = "hoy" | "ayer" | "ultimos7" | "ultimos30" | "semana" | "mes"

export const sameDay = (a?: Date, b?: Date) =>
    Boolean(a && b && moment(a).isSame(moment(b), "day"))

export const getDatePresetRange = (id: DatePresetId): { from: Date; to: Date } => {
    const today = moment().startOf("day")
    switch (id) {
        case "hoy":
            return { from: today.toDate(), to: today.toDate() }
        case "ayer": {
            const yesterday = today.clone().subtract(1, "day")
            return { from: yesterday.toDate(), to: yesterday.toDate() }
        }
        case "ultimos7":
            return {
                from: today.clone().subtract(6, "days").toDate(),
                to: today.toDate(),
            }
        case "ultimos30":
            return {
                from: today.clone().subtract(29, "days").toDate(),
                to: today.toDate(),
            }
        case "semana":
            return {
                from: today.clone().startOf("isoWeek").toDate(),
                to: today.clone().endOf("isoWeek").startOf("day").toDate(),
            }
        case "mes":
            return {
                from: today.clone().startOf("month").toDate(),
                to: today.clone().endOf("month").startOf("day").toDate(),
            }
    }
}

export const DATE_PRESETS: {
    id: DatePresetId
    label: string
    tone: { idle: string; active: string }
}[] = [
    {
        id: "hoy",
        label: "Hoy",
        tone: {
            idle: "border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-400 hover:bg-sky-100",
            active: "border-sky-600 bg-sky-600 text-white shadow-sm shadow-sky-200",
        },
    },
    {
        id: "ayer",
        label: "Ayer",
        tone: {
            idle: "border-violet-200 bg-violet-50 text-violet-700 hover:border-violet-400 hover:bg-violet-100",
            active: "border-violet-600 bg-violet-600 text-white shadow-sm shadow-violet-200",
        },
    },
    {
        id: "ultimos7",
        label: "Últimos 7 días",
        tone: {
            idle: "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-100",
            active: "border-emerald-600 bg-emerald-600 text-white shadow-sm shadow-emerald-200",
        },
    },
    {
        id: "semana",
        label: "Semana actual",
        tone: {
            idle: "border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-400 hover:bg-amber-100",
            active: "border-amber-500 bg-amber-500 text-white shadow-sm shadow-amber-200",
        },
    },
    {
        id: "ultimos30",
        label: "Últimos 30 días",
        tone: {
            idle: "border-teal-200 bg-teal-50 text-teal-700 hover:border-teal-400 hover:bg-teal-100",
            active: "border-teal-600 bg-teal-600 text-white shadow-sm shadow-teal-200",
        },
    },
    {
        id: "mes",
        label: "Mes actual",
        tone: {
            idle: "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-400 hover:bg-rose-100",
            active: "border-rose-600 bg-rose-600 text-white shadow-sm shadow-rose-200",
        },
    },
]

export const matchDatePreset = (from?: Date, to?: Date): DatePresetId | null => {
    if (!from || !to) return null
    for (const preset of DATE_PRESETS) {
        const range = getDatePresetRange(preset.id)
        if (sameDay(from, range.from) && sameDay(to, range.to)) return preset.id
    }
    return null
}
