import { FileCog, FileText, Save } from "lucide-react"
import { PermisoViaje } from "../../../../services/api/extraprotocolares/permisoViajeService"
import SimpleInput from "../../../ui/SimpleInput"
import SimpleSelectorStr from "../../../ui/SimpleSelectosStr"
import { PERMISO_VIAJE_ASUNTOS, PERMISO_VIAJE_VIA } from "../../../../data/permisoViajeData"
import { useState } from "react"
import TimePicker from "../../../ui/TimePicker"
import moment from "moment"
import Calendar from "../../../ui/Calendar"
import ParticipantesMain from "./participantes/ParticipantesMain"

interface Props {
    permisoViaje?: PermisoViaje
}

const PermisoForm = ({ permisoViaje }: Props) => {

    const [tipoPermiso, setTipoPermiso] = useState(permisoViaje ? permisoViaje.asunto : '');
    const [hora, setHora] = useState<string | undefined>(
        permisoViaje?.hora_recep ? moment(permisoViaje.hora_recep, "HH:mm").format("HH:mm") : undefined
    );

    const [fechaIngreso, setFechaIngreso] = useState<Date | undefined>(
        permisoViaje?.fec_ingreso ? new Date(permisoViaje.fec_ingreso) : undefined
    )
    const [motivo, setMotivo] = useState(permisoViaje?.referencia || '');
    const [nomComunicarse, setNomComunicarse] = useState(permisoViaje?.nom_comu || '');
    const [telComunicarse, setTelComunicarse] = useState(permisoViaje?.tel_comu || '');
    const [emailComunicarse, setEmailComunicarse] = useState(permisoViaje?.email_comu || '');
    const [via, setVia] = useState(permisoViaje?.via || '');
    const [lugarFormu, setLugarFormu] = useState(permisoViaje?.lugar_formu || '');
    const [fechaDesde, setFechaDesde] = useState<Date | undefined>(
        permisoViaje?.fecha_desde ? new Date(permisoViaje.fecha_desde) : undefined
    );
    const [fechaHasta, setFechaHasta] = useState<Date | undefined>(
        permisoViaje?.fecha_hasta ? new Date(permisoViaje.fecha_hasta) : undefined
    );

    const [observacion, setObservacion] = useState(permisoViaje?.observacion || '');

  return (
    <>
    <div>
        <h2 className="text-lg font-semibold text-center mb-8">Formulario del Permiso de Viaje</h2>
        <>{console.log('permisoViaje', permisoViaje)}</>
        <div className="grid grid-cols-8 gap-2">
            <div className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                <Save className="text-xl"/>
                <p className="text-xs">Guardar</p>
            </div>
            <div className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                <FileCog className="text-xl text-green-600"/>
                <p className="text-xs">Generar</p>
            </div>
            <div className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                <FileText className="text-xl text-slate-50"/>
                <p className="text-xs">Ver Doc</p>
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleInput 
                label="Nro de control"
                value={permisoViaje?.num_formu || ''}
                setValue={() => {}}
                horizontal
                disabled
            />
            <SimpleInput 
                label="Encargado"
                value={permisoViaje?.num_kardex || ''}
                setValue={() => {}}
                horizontal
                disabled
            />
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleSelectorStr 
                label="Tipo de permiso"
                options={[
                    { value: '', label: 'Seleccione un tipo de permiso' },
                    ...PERMISO_VIAJE_ASUNTOS.map(asunto => ({
                        value: asunto.cod_asunto,
                        label: asunto.des_asunto
                    }))
                ]}
                defaultValue={tipoPermiso}
                setter={setTipoPermiso}
            />
            <div className="flex items-center justify-end w-[40%] gap-2">
                {/* <p className="pl-2 block text-xs font-semibold text-slate-700">Hora</p> */}
                <TimePicker
                    selectedTime={hora}
                    setSelectedTime={setHora}
                />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <div className="grid grid-cols-3 items-center gap-2">
                <p className="pl-2 block text-xs font-semibold text-slate-700">Fecha de ingreso</p>
                <Calendar
                    selectedDate={fechaIngreso}
                    setSelectedDate={setFechaIngreso}   
                />
            </div>
            <SimpleInput 
                label="Motivo"
                value={motivo}
                setValue={setMotivo}
                horizontal
            />
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleInput 
                label="Comunicarse con"
                value={nomComunicarse}
                setValue={setNomComunicarse}
                horizontal
            />
            <SimpleInput 
                label="Teléfono"
                value={telComunicarse}
                setValue={setTelComunicarse}
                horizontal
            />
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleInput 
                label="Correo electrónico"
                value={emailComunicarse}
                setValue={setEmailComunicarse}
                horizontal
            />
            <SimpleSelectorStr
                label="Vía"
                options={[
                    { value: '', label: 'Seleccione una vía' },
                    ...PERMISO_VIAJE_VIA.map(via => ({
                        value: via.des_via,
                        label: via.des_via
                    }))
                ]}
                defaultValue={via}
                setter={setVia}
            
            />
        </div>
        <div className="grid grid-cols-1 gap-4 my-4">
            <SimpleInput 
                label="Viaja a"
                value={lugarFormu}
                setValue={setLugarFormu}
                horizontal
                fullWidth
            />
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <div className="grid grid-cols-3 items-center gap-2">
                <p className="pl-2 block text-xs font-semibold text-slate-700">Fecha desde</p>
                <Calendar
                    selectedDate={fechaDesde}
                    setSelectedDate={setFechaDesde}   
                />
            </div>
            <div className="grid grid-cols-3 items-center gap-2">
                <p className="pl-2 block text-xs font-semibold text-slate-700">Fecha hasta</p>
                <Calendar
                    selectedDate={fechaHasta}
                    setSelectedDate={setFechaHasta}   
                />
            </div>
        </div>
        <h2 className="text-lg text-center text-xs font-semibold my-4">Observaciones</h2>
        <textarea className="w-full h-32 p-2 border border-gray-300 rounded-md" value={observacion} onChange={(e) => setObservacion(e.target.value)}></textarea>
    </div>
    {permisoViaje &&             
        <ParticipantesMain />
    }
    </>
  )
}

export default PermisoForm