import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Search } from "lucide-react"
import { KardexPage } from "../../../services/api/kardexService"
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"

interface Props {
    setCorrelative: React.Dispatch<React.SetStateAction<string>>
    setName: React.Dispatch<React.SetStateAction<string>>
    setDocument: React.Dispatch<React.SetStateAction<string>>
    setNumescritura: React.Dispatch<React.SetStateAction<string>>
    correlative: string
    name: string
    document: string
    numescritura: string
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<KardexPage, Error>>
}

const KardexFilters = ({ 
    setCorrelative, 
    setName, 
    setDocument, 
    setNumescritura, 
    correlative, 
    name, 
    document, 
    numescritura, 
    refetch }: Props) => {


    const [loading, setLoading] = useState(false)

    const fields = [
        { label: 'Nº Kardex', value: correlative, setter: setCorrelative },
        { label: 'Nro Doc', value: document, setter: setDocument },
        { label: 'Nombre', value: name, setter: setName },
        { label: 'Nº Escr/Act', value: numescritura, setter: setNumescritura },
    ]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        
        refetch().finally(() => {
            setLoading(false)
        })
    }
        

  return (
    <form 
        onSubmit={handleSubmit}
        className="w-full border-b border-slate-200 bg-slate-50/70 px-6 py-3">
        <p className="mb-2 text-xs font-semibold text-slate-700">Búsqueda por:</p>
        <div className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2">
            {fields.map((field, i) => (
                <motion.div
                    key={field.label}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.05 + i * 0.05 }}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 transition-shadow focus-within:border-sky-300 focus-within:shadow-md focus-within:shadow-sky-100"
                >
                    <p className="min-w-20 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{field.label}</p>
                    <input 
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                        type="text" 
                        className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200" />
                </motion.div>
            ))}
            <motion.button 
                disabled={loading} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                whileHover={loading ? undefined : { y: -1 }}
                whileTap={loading ? undefined : { scale: 0.96 }}
                className="ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-blue-700 bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2">
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                {loading ? 'Buscando...' : 'Buscar'}
            </motion.button>
        </div>
    </form>
  )
}

export default KardexFilters