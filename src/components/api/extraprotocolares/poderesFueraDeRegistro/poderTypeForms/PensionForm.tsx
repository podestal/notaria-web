
import { useState } from "react"
import SimpleInput from "../../../../ui/SimpleInput";
import moment from "moment";
import DateInput from "../../../../ui/DateInput";
import { PoderPension } from "../../../../../services/api/extraprotocolares/poderPension";
import useCreateUpdatePension from "../../../../../hooks/api/extraprotocolares/ingresoPoderes/poderes/useCreateUpdatePension";
import useAuthStore from "../../../../../store/useAuthStore";
import useNotificationsStore from "../../../../../hooks/store/useNotificationsStore";

interface Props {
    poderId: number;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    poderPension: PoderPension
}

const PensionForm = ({ poderId, setOpen, poderPension }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const {setMessage, setShow, setType} = useNotificationsStore()

    const [isLoading, setIsLoading] = useState(false)
    const [monto, setMonto] = useState(poderPension?.p_pension || '')
    const [plazo, setPlazo] = useState(poderPension?.p_plazopoder || '')
    const [fechaEmision, setFechaEmision] = useState(poderPension?.p_fecotor || moment().format('DD/MM/YYYY'))
    const [fechaVencimiento, setFechaVencimiento] = useState(poderPension?.p_fecvcto || moment().format('DD/MM/YYYY'))
    const [presentacion, setPresentacion] = useState(poderPension?.p_presauto || '')

    const createUpdatePension = useCreateUpdatePension({ idPoderPension: poderPension?.id_pension, poderId })

    const handleSave = () => {
        setIsLoading(true)
        createUpdatePension.mutate({
            poderPension: {
                p_pension: monto,
                p_plazopoder: plazo,
                p_fecotor: fechaEmision,
                p_fecvcto: fechaVencimiento,
                p_presauto: presentacion,
                id_poder: poderId,
                p_crono: poderPension?.p_crono || '',
                p_fecha: poderPension?.p_fecha || '',
                p_numformu: poderPension?.p_numformu || '',
                p_domicilio: poderPension?.p_domicilio || '',
                p_mespension: poderPension?.p_mespension || '',
                p_anopension: poderPension?.p_anopension || '',
                p_observ: poderPension?.p_observ || '',
            },
            access
        }, {
            onSuccess: () => {
                setMessage('Pension actualizada correctamente')
                setShow(true)
                setType('success')
                setOpen(false)
            },
            onError: () => {
                setMessage('Error al actualizar la pension')
                setShow(true)
                setType('error')
            },
            onSettled: () => {
                setIsLoading(false)
            }
        })


    }
    
  return (
<div>
    <h2 className="text-lg font-bold mb-4 text-center">Pensiones</h2>
    <>{console.log('poderPension', poderPension)}</>
    <div className="grid grid-cols-2 gap-4 my-4">
        <SimpleInput
            label="Monto"
            value={monto}
            setValue={setMonto}
            horizontal
        />
    </div>
    <p className="text-sm font-semibold text-slate-700 px-2 my-4">La ONP, administra, durante el periodo en que se otorga el presente poder:</p>
    <div className="grid grid-cols-2 gap-4 my-4">
       <SimpleInput
            label="Plazo"
            value={plazo}
            setValue={setPlazo}
            horizontal
        />
    </div>
    <div className="grid grid-cols-2 gap-4 my-4">
        <DateInput 
            label="Fecha de otorgamiento"
            value={fechaEmision}
            setValue={setFechaEmision}
            horizontal
        />
        <DateInput 
            label="Fecha de vencimiento"
            value={fechaVencimiento}
            setValue={setFechaVencimiento}
            horizontal
        />
    </div>
    <div className="w-full gap-4 my-4">
       <SimpleInput
            label="Presentacion Autorizada"
            value={presentacion}
            setValue={setPresentacion}
            horizontal
            fullWidth
        />
    </div>
    <div className="flex justify-evenly items-center my-8">
        <button 
            className=" bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer transition-all duration-300"
            onClick={handleSave}
            disabled={isLoading}
        >{isLoading ? 'Guardando...' : 'Guardar'}</button>
        <button 
            className=" bg-red-500 text-white p-2 rounded-md hover:bg-red-600 cursor-pointer transition-all duration-300"
            onClick={() => setOpen(false)}
        >Cancelar</button>
    </div>    

</div>
  )
}

export default PensionForm