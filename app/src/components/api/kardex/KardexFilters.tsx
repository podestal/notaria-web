import { useState } from "react"
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
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5">
                <p className="min-w-20 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Nº Kardex</p>
                <input 
                    value={correlative}
                    onChange={(e) => {
                        setCorrelative(e.target.value)
                    }}
                    type="text" 
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200" />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5">
                <p className="min-w-20 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Nro Doc</p>
                <input 
                    value={document}
                    onChange={(e) => {
                        setDocument(e.target.value)
                    }}
                    type="text" 
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200" />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5">
                <p className="min-w-20 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Nombre</p>
                <input 
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                    type="text" 
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200" />
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5">
                <p className="min-w-20 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Nº Escr/Act</p>
                <input 
                    value={numescritura}
                    onChange={(e) => {
                        setNumescritura(e.target.value)
                    }}
                    type="text"
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200" />
            </div>
            <button 
                disabled={loading} 
                className="ml-auto rounded-lg border border-sky-700 bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition duration-300 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2">
                {loading ? 'Buscando...' : 'Buscar'}
            </button>
        </div>
    </form>
  )
}

export default KardexFilters