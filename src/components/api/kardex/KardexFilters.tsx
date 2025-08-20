import { useEffect, useState } from "react"
import useBodyRenderStore from "../../../hooks/store/bodyRenderStore"
import useCorrelativeStore from "../../../hooks/store/useCorrelativeStore"
import useKardexFiltersStore from "../../../hooks/store/useKardexFiltersStore"

const kardexTypes: Record<number, string> = {
    1: 'KAR',
    2: 'NCT',
    3: 'ACT',
    4: 'GAM',
    5: 'TES',
}

interface Props {
    setCorrelative: React.Dispatch<React.SetStateAction<string>>
    setName: React.Dispatch<React.SetStateAction<string>>
    setDocument: React.Dispatch<React.SetStateAction<string>>
    setNumescritura: React.Dispatch<React.SetStateAction<string>>
    correlative: string
    name: string
    document: string
    numescritura: string
    refetch: () => void
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        refetch()
    }
        

  return (
    <form 
        onSubmit={handleSubmit}
        className="w-full flex-col justify-between items-center py-4 px-2 mb-6 border-b-2 border-dashed border-slate-950">
        <p className="mb-4">Busqueda por:</p>
        <div className="flex justify-between items-center gap-8 text-xs">
            <div className="flex items-center justify-center gap-2">
                <p>Nº Kardex:</p>
                <input 
                    value={correlative}
                    onChange={(e) => {
                        setCorrelative(e.target.value)
                    }}
                    type="text" 
                    className="bg-white text-slate-700 border border-slate-300 rounded-md p-1" />
            </div>
            <div className="flex items-center justify-center gap-2">
                <p>Nro Doc:</p>
                <input 
                    value={document}
                    onChange={(e) => {
                        setDocument(e.target.value)
                    }}
                    type="text" 
                    className="bg-white text-slate-700 border border-slate-300 rounded-md p-1" />
            </div>
            <div className="flex items-center justify-center gap-2">
                <p>Nombre:</p>
                <input 
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                    }}
                    type="text" 
                    className="bg-white text-slate-700 border border-slate-300 rounded-md p-1" />
            </div>
            <div className="flex items-center justify-center gap-2">
                <p>Nº Escr/Act:</p>
                <input 
                    value={numescritura}
                    onChange={(e) => {
                        setNumescritura(e.target.value)
                    }}
                    type="text" className="bg-white text-slate-700 border border-slate-300 rounded-md p-1" />
            </div>
            <button className="bg-gray-50 px-2 py-1 transition duration-300 text-xs border-1 border-gray-300 cursor-pointer hover:bg-gray-300 rounded-md">Buscar</button>
        </div>
    </form>
  )
}

export default KardexFilters