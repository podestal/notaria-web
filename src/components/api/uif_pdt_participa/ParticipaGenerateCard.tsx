import { useState, useCallback } from "react"
import { debounce } from "lodash" 
import { ContratantesPorActo } from "../../../services/api/contratantesPorActoService"
import getTitleCase from "../../../utils/getTitleCase"

interface Props {
    contratante: ContratantesPorActo
    detalleActo: string
}

const ParticipaGenerateCard = ({ contratante, detalleActo }: Props) => {
    const [porcentaje, setPorcentaje] = useState(contratante.porcentaje || '')
    const [isUpdating, setIsUpdating] = useState(false)

    // Updated regex to properly handle decimal points
    const isValidPercentage = (value: string): boolean => {
        // Allow empty string
        if (value === '') return true
        
        // Allow just a decimal point for user convenience
        if (value === '.') return true
        
        // Regex: allows numbers 0-100 with optional decimal places
        // Examples: 0, 50, 100, 0., 50.5, 25.75, 99.99
        const percentageRegex = /^(100(\.0{0,2})?|[0-9]?[0-9](\.[0-9]{0,2})?)$/
        return percentageRegex.test(value)
    }

    // Debounced update function
    const debouncedUpdate = useCallback(
        debounce(async (newPorcentaje: string) => {
            try {
                setIsUpdating(true)
                // Your API call here
                // await updatePorcentaje(contratante.id, newPorcentaje)
                console.log('newPorcentaje', newPorcentaje);
                
            } catch (error) {
                console.error('Error updating percentage:', error)
            } finally {
                setIsUpdating(false)
            }
        }, 700),
        [contratante.id]
    )

    const handleChangePorcentaje = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        
        // Only update if the value is valid
        if (isValidPercentage(newValue)) {
            setPorcentaje(newValue)
            debouncedUpdate(newValue)
        }
    }

    return (
        <div className="grid grid-cols-11 text-xs text-black p-2 my-2 place-content-center border-b-2 border-gray-200 text-center">
            <p className="col-span-3">{getTitleCase(detalleActo || '')}</p>
            <p className="col-span-3">{getTitleCase(contratante.cliente || '')}</p>
            <p className="col-span-2">{getTitleCase(contratante.condicion_str || '')}</p>
            <input 
                className="text-center rounded-xl py-1 bg-slate-100" 
                value={porcentaje} 
                onChange={handleChangePorcentaje}
                disabled={isUpdating}
                placeholder="0.00"
                type="text"
                inputMode="decimal"
            />

            <p>{contratante.uif}</p>
        </div>
    )
}

export default ParticipaGenerateCard