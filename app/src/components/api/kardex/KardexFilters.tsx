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
        className="w-full bg-slate-50/70 px-6 py-5 border-b border-slate-200">
        <p className="mb-4 text-sm font-semibold text-slate-700">Búsqueda por:</p>
        <div className="grid grid-cols-9 gap-4 text-xs">
            <div className="flex items-center justify-center gap-2 col-span-2">
                <p className="text-slate-600">Nº Kardex:</p>
                <input 
                    value={correlative}
                    onChange={(e) => {
                        setCorrelative(e.target.value)
                    }}
                    type="text" 
                    className="bg-white text-slate-700 border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-300" />
            </div>
            <div className="flex items-center justify-center gap-2 col-span-2">
                <p className="text-slate-600">Nro Doc:</p>
                <input 
                    value={document}
                    onChange={(e) => {
                        setDocument(e.target.value)
                    }}
                    type="text" 
                    className="bg-white text-slate-700 border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-300" />
            </div>
            <div className="flex items-center justify-center gap-2 col-span-2">
                <p className="text-slate-600">Nombre:</p>
                <input 
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                    type="text" 
                    className="bg-white text-slate-700 border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-300" />
            </div>
            <div className="flex items-center justify-center gap-2 col-span-2">
                <p className="text-slate-600">Nº Escr/Act:</p>
                <input 
                    value={numescritura}
                    onChange={(e) => {
                        setNumescritura(e.target.value)
                    }}
                    type="text" className="bg-white text-slate-700 border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-300" />
            </div>
            <button 
                disabled={loading} 
                className="bg-sky-600 px-3 py-2 transition duration-300 text-xs font-semibold text-white border border-sky-700 cursor-pointer hover:bg-sky-700 rounded-md disabled:opacity-60 disabled:cursor-not-allowed shadow-sm">
                {loading ? 'Buscando...' : 'Buscar'}
            </button>
        </div>
    </form>
  )
}

export default KardexFilters