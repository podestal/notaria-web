import { useState, useCallback, useEffect } from "react"
import { debounce } from "lodash" 
import { ContratantesPorActo } from "../../../services/api/contratantesPorActoService"
import getTitleCase from "../../../utils/getTitleCase"
import useUpdateContratantePorActo from "../../../hooks/api/contratantesPorActo/useUpdateContratantePorActo"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import ParticipaRenta from "./renta/ParticipaRenta"

interface Props {
    contratante: ContratantesPorActo
    detalleActo: string
    monto?: string
    kardex: string
}

const ParticipaGenerateCard = ({ contratante, detalleActo, monto, kardex }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const [porcentaje, setPorcentaje] = useState(contratante.porcentaje || '')
    const [origenDeFondos, setOrigenDeFondos] = useState(contratante.ofondo || '')
    const [isUpdating, setIsUpdating] = useState(false)
    const updateContratantePorActo = useUpdateContratantePorActo({ kardex: contratante.kardex, id: contratante.id })
    const { setMessage, setShow, setType } = useNotificationsStore()

    useEffect(() => {
        setPorcentaje(contratante.porcentaje || '')
    }, [contratante.porcentaje])
    
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
        debounce(async (newPorcentaje: string, newOrigenDeFondos: string) => {
            try {
                setIsUpdating(true)
                const newMonto = (Number(newPorcentaje) / 100) * Number(monto)
                updateContratantePorActo.mutate({
                    access,
                    contratantePorActo: {
                        ...contratante,
                        porcentaje: newPorcentaje,
                        monto: newMonto.toFixed(2),
                        ofondo: newOrigenDeFondos
                    }
                }, {
                    onSuccess: () => {
                        setMessage('Porcentaje actualizado correctamente')
                        setShow(true)
                        setType('success')
                    },
                    onError: () => {
                        setMessage('Error al actualizar el porcentaje')
                        setShow(true)
                        setType('error')
                    }
                })
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
            debouncedUpdate(newValue, origenDeFondos)
        }
    }

    const handleChangeOrigenDeFondos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setOrigenDeFondos(newValue)
        debouncedUpdate(porcentaje, newValue)
    }

    return (
        <div className="grid grid-cols-11 text-xs text-black p-2 place-content-center border-b-2 border-gray-200 text-center my-auto">
            <p className="col-span-2 text-left">{getTitleCase(detalleActo || '')}</p>
            <p className="col-span-2 text-left">{getTitleCase(contratante.cliente || '')}</p>
            <p className="text-left">{getTitleCase(contratante.condicion_str || '')}</p>
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
            {contratante.formulario === '1' ? 
            <ParticipaRenta 
                kardex={kardex}
                contratante={contratante}
            />: <p></p>}
            <p>{contratante.monto}</p>
            <input 
                className="px-1 rounded-xl pb-4 bg-slate-100 col-span-2" 
                value={origenDeFondos} 
                onChange={handleChangeOrigenDeFondos}
                disabled={isUpdating}
                placeholder="Origen de Fondos"
                type="text"

            />
        </div>
    )
}

export default ParticipaGenerateCard