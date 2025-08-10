
import { useEffect, useState } from "react"
import SimpleInput from "../../../../ui/SimpleInput";
import DateInput from "../../../../ui/DateInput";
import { PoderRegistro } from "../../../../../services/api/extraprotocolares/poderRegistroService";
import SimpleSelectorStr from "../../../../ui/SimpleSelectosStr";

interface Props {
    poderId: number;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    poderRegistro: PoderRegistro
}


const FueraDeRegistroForm = ({ poderId, setOpen, poderRegistro }: Props) => {
    const [tipoRegistro, setTipoRegistro] = useState(poderRegistro?.id_tipo || '0')
    const [plazo, setPlazo] = useState(poderRegistro?.f_plazopoder || '')
    const [fechaOtorgamiento, setFechaOtorgamiento] = useState(poderRegistro?.f_fecotor || '')
    const [fechaVencimiento, setFechaVencimiento] = useState(poderRegistro?.f_fecvcto || '')
    const [solicita, setSolicita] = useState(poderRegistro?.f_solicita || '')
    
    useEffect(() => {
        if (tipoRegistro === '1') {
            setSolicita(`1.- Apersonarse ante las Oficinas correspondientes de <AMBITO>
2.- <MOTIVO>............, para ello queda facultad<C_O_A> para que pueda firmar los documentos que con tal ocasi�n sean necesarios. `)
        } else if (tipoRegistro === '2') {
            setSolicita(`PRIMERO.- SE APERSONE A LA DIRECCION REGIONAL DE EDUCACION - LA LIBERTAD, CON LA FINALIDAD DE RECABAR SUS BOLETAS DE PAGO DEL MES DE ENERO 2016 AL MES DE ENERO 2017. ASIMISMO ESTA FACULTADA A RECABAR TODAS LAS BOLETAS DE PAGO DE SU CONYUGUE QUE EN VIDA FUERA DON:
SEGUNDO.- REALIZAR LOS TRAMITES ADMINISTRATIVOS SOBRE LA DOCUMENTACION QUE ESTE A SU NOMBRE, HABIDAS Y POR HABER, QUE REQUIERA LA CITADA INSTITUCION, PRESENTADO Y SUSCRIBIENDO LA DOCUMENTACION QUE SE LE REQUIERA, ESTE PODER ES DURANTE UN A�O A PARTIR DE LA FECHA. PARA CUYO FIN AUTORIZA A SU CITADA APODERADA PARA REALIZAR DICHA DILIGENCIA COMO SI FUERA ELLA MISMA, FIRMANDO PLANILLAS Y/O LOS DOCUMENTOS QUE LE SEAN REQUERIDOS.`)
        } else {
            setSolicita('')
        }
    }, [tipoRegistro])

    const handleSave = () => {

    }
    
  return (
    <div>
    <h2 className="text-lg font-bold mb-4 text-center">Formato Libre</h2>
    {console.log(poderRegistro)}
    <div className="grid grid-cols-2 gap-4 my-4">
        <SimpleSelectorStr
            label="Tipo"
            defaultValue={tipoRegistro}
            setter={setTipoRegistro}
            options={[{ value: '0', label: 'Seleccionar Tipo' }, { value: '1', label: 'Registro' }, { value: '2', label: 'Poder fuera de registro base' }]}
        />
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
            value={fechaOtorgamiento}
            setValue={setFechaOtorgamiento}
            horizontal
        />
        <DateInput 
            label="Fecha de vencimiento"
            value={fechaVencimiento}
            setValue={setFechaVencimiento}
            horizontal
        />
    </div>
    <div className="flex gap-4 justify-center items-start my-4">
        <p className="pl-2 text-xs font-semibold text-slate-700">Solicita</p>
        <textarea
            value={solicita}
            onChange={(e) => setSolicita(e.target.value)}
            className="w-full h-32 p-2 border border-slate-300 rounded"
        />
    </div>
    <div className="flex justify-evenly items-center my-4">
        <button 
            className=" bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer transition-all duration-300"
            onClick={handleSave}
        >Guardar</button>
        <button 
            className=" bg-red-500 text-white p-2 rounded-md hover:bg-red-600 cursor-pointer transition-all duration-300"
            onClick={() => setOpen(false)}
        >Cancelar</button>
    </div>    

</div>
  )
}

export default FueraDeRegistroForm