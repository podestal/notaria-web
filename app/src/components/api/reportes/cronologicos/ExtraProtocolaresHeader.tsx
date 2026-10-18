import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import Calendar from "../../../ui/Calendar"
import { Sheet, FileText, Loader2, Search, CalendarDays } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import axios from "axios"
import useAuthStore from "../../../../store/useAuthStore"
import SingleSelect from "../../../ui/SingleSelect"

interface Props {
    dateFrom: Date | undefined
    dateTo: Date | undefined
    setDateFrom: React.Dispatch<React.SetStateAction<Date | undefined>>
    setDateTo: React.Dispatch<React.SetStateAction<Date | undefined>>
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>
    generatesWord: boolean
    generatesExcel: boolean
    url: string
    params: Record<string, string>
    name: string
    orientation?: string
}

const ExtraProtocolaresHeader = ({
    dateFrom,
    dateTo,
    setDateFrom,
    setDateTo,
    refetch,
    url,
    params,
    name,
    orientation,
}: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const apiURL = import.meta.env.VITE_API_URL
    const [loadingWord, setLoadingWord] = useState(false)
    const [loadingExcel, setLoadingExcel] = useState(false)
    const [loading, setLoading] = useState(false)
    const [selectedOrientation, setSelectedOrientation] = useState(orientation)

    const handleFilter = () => {
        if (loading) return
        setLoading(true)
        refetch().finally(() => {
            setLoading(false)
        })
    }

    const handleGenerateWord = async () => {
        if (loadingWord) return
        setLoadingWord(true)
        try {
            const response = await axios.get(`${apiURL}${url}/`, {
                responseType: "blob",
                headers: { Authorization: `JWT ${access}` },
                params: { ...params, orientation: selectedOrientation },
            })
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            })
            const blobUrl = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = blobUrl
            link.download = name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000)
        } catch (error) {
            console.log("error", error)
        } finally {
            setLoadingWord(false)
        }
    }

    const handleGenerateExcel = async () => {
        if (loadingExcel) return
        setLoadingExcel(true)
        try {
            const response = await axios.get(`${apiURL}${url}/`, {
                responseType: "blob",
                headers: { Authorization: `JWT ${access}` },
                params: { ...params, tipo_documento: "EXCEL" },
            })
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
            const blobUrl = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = blobUrl
            link.download = `${name}.xlsx`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000)
        } catch (error) {
            console.log("error", error)
        } finally {
            setLoadingExcel(false)
        }
    }

    return (
        <div className="border-b border-slate-200 bg-slate-50/70 p-4 sm:p-5">
            <div className="flex flex-wrap items-end gap-4">
                <div className="flex min-w-[12rem] flex-1 flex-col gap-1.5">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5" /> Fecha inicio
                    </p>
                    <Calendar selectedDate={dateFrom} setSelectedDate={setDateFrom} fullWidth />
                </div>
                <div className="flex min-w-[12rem] flex-1 flex-col gap-1.5">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        <CalendarDays className="h-3.5 w-3.5" /> Fecha fin
                    </p>
                    <Calendar selectedDate={dateTo} setSelectedDate={setDateTo} fullWidth />
                </div>
                {selectedOrientation && (
                    <div className="flex min-w-[12rem] flex-1 flex-col gap-1.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Orientación</p>
                        <SingleSelect
                            options={[
                                { value: "horizontal", label: "Horizontal" },
                                { value: "vertical", label: "Vertical" },
                            ]}
                            selected={selectedOrientation}
                            onChange={(value) => setSelectedOrientation(value)}
                        />
                    </div>
                )}
                <motion.button
                    type="button"
                    onClick={handleFilter}
                    disabled={loading}
                    whileHover={loading ? undefined : { y: -1 }}
                    whileTap={loading ? undefined : { scale: 0.97 }}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-700 bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    {loading ? "Buscando..." : "Buscar"}
                </motion.button>

                <div className="ml-auto flex items-center gap-2">
                    <motion.button
                        type="button"
                        onClick={handleGenerateWord}
                        disabled={loadingWord}
                        whileHover={loadingWord ? undefined : { y: -2 }}
                        whileTap={loadingWord ? undefined : { scale: 0.96 }}
                        className="inline-flex min-w-[5.5rem] flex-col items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-60"
                    >
                        {loadingWord ? (
                            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                        ) : (
                            <FileText className="h-5 w-5 text-blue-500" />
                        )}
                        <span className="text-[10px] font-semibold">
                            {loadingWord ? "Cargando..." : "Word"}
                        </span>
                    </motion.button>
                    <motion.button
                        type="button"
                        onClick={handleGenerateExcel}
                        disabled={loadingExcel}
                        whileHover={loadingExcel ? undefined : { y: -2 }}
                        whileTap={loadingExcel ? undefined : { scale: 0.96 }}
                        className="inline-flex min-w-[5.5rem] flex-col items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-600 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-60"
                    >
                        {loadingExcel ? (
                            <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                        ) : (
                            <Sheet className="h-5 w-5 text-emerald-500" />
                        )}
                        <span className="text-[10px] font-semibold">
                            {loadingExcel ? "Cargando..." : "Excel"}
                        </span>
                    </motion.button>
                </div>
            </div>
        </div>
    )
}

export default ExtraProtocolaresHeader
