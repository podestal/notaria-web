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
    const [origenDeFondos, setOrigenDeFondos] = useState(getTitleCase(contratante.ofondo || '') || '')
    const [localMonto, setLocalMonto] = useState(contratante.monto || '')
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

    const debouncedUpdateMonto = useCallback(
        debounce(async (newMonto: string) => {
            try {
                setIsUpdating(true)
                // const newMonto = (Number(newPorcentaje) / 100) * Number(monto)
                const newPorcentaje = (Number(newMonto) / Number(monto)) * 100
                updateContratantePorActo.mutate({
                    access,
                    contratantePorActo: {
                        ...contratante,
                        monto: newMonto,
                        porcentaje: newPorcentaje.toFixed(2)
                    }
                }, {
                    onSuccess: res => {
                        console.log('res', res)
                        setPorcentaje(res.porcentaje)
                        setMessage('Monto actualizado correctamente')
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
        []
    )

    // Debounced update function
    const debouncedUpdatePorcentaje = useCallback(
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
                    onSuccess: res => {
                        console.log('res', res)
                        setLocalMonto(res.monto)
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
            debouncedUpdatePorcentaje(newValue, origenDeFondos)
        }
    }

    const handleChangeOrigenDeFondos = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setOrigenDeFondos(newValue)
        debouncedUpdatePorcentaje(porcentaje, newValue)
    }

    const handleChangeMonto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setLocalMonto(newValue)
        debouncedUpdateMonto(newValue)
    }

    return (
        <div>
            <div className="min-w-[1200px] grid grid-cols-11 text-xs text-black p-2 place-content-center border-b-2 border-gray-200 text-center my-auto gap-2">
                <p className="col-span-2">{getTitleCase(detalleActo || '')}</p>
                <p className="col-span-2">{getTitleCase(contratante.cliente || '')}</p>
                <p className="">{getTitleCase(contratante.condicion_str || '')}</p>
                <input 
                    className="text-center rounded-xl py-1 bg-slate-100 mx-1 h-6" 
                    value={porcentaje} 
                    onChange={handleChangePorcentaje}
                    disabled={isUpdating}
                    placeholder="0.00"
                    type="text"
                    inputMode="decimal"
                />

                <p className="">{contratante.uif}</p>
                {contratante.formulario === '1' ? 
                <ParticipaRenta 
                    kardex={kardex}
                    contratante={contratante}
                />: <p></p>}
                <input 
                    className="rounded-xl py-1 px-2 bg-slate-100 mx- h-6 text-center" 
                    value={localMonto}
                    onChange={handleChangeMonto}
                    disabled={isUpdating}
                    placeholder="Monto"
                    type="text"
                />
                <input 
                    className="rounded-xl pb-4 px-2 bg-slate-100 col-span-2 mx-1" 
                    value={origenDeFondos} 
                    onChange={handleChangeOrigenDeFondos}
                    disabled={isUpdating}
                    placeholder="Origen de Fondos"
                    type="text"
                />
            </div>
        </div>
    )
}

export default ParticipaGenerateCard