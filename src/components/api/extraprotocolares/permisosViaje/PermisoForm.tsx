import { FileText, FileWarning, QrCode, Save } from "lucide-react"
import { PermisoViaje } from "../../../../services/api/extraprotocolares/permisoViajeService"
import SimpleInput from "../../../ui/SimpleInput"
import SimpleSelectorStr from "../../../ui/SimpleSelectosStr"
import { PERMISO_VIAJE_ASUNTOS, PERMISO_VIAJE_VIA } from "../../../../data/permisoViajeData"
import { useState } from "react"
import TimePicker from "../../../ui/TimePicker"
import moment from "moment"
import Calendar from "../../../ui/Calendar"
import ParticipantesMain from "./participantes/ParticipantesMain"
import { UseMutationResult } from "@tanstack/react-query"
import { CreatePermisoViajeData } from "../../../../hooks/api/extraprotocolares/permisosViaje/useCreatePermisoViaje"
import useAuthStore from "../../../../store/useAuthStore"
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore"
import { UpdatePermisoViajeData } from "../../../../hooks/api/extraprotocolares/permisosViaje/useUpdatePermisoViaje"
import GenerarDocumento from "../documentos/GenerarDocumento"

interface Props {
    permisoViaje?: PermisoViaje
    createPermisoViaje?: UseMutationResult<PermisoViaje, Error, CreatePermisoViajeData>
    updatePermisoViaje?: UseMutationResult<PermisoViaje, Error, UpdatePermisoViajeData>
}

const PermisoForm = ({ permisoViaje, createPermisoViaje, updatePermisoViaje }: Props) => {

    const access = useAuthStore(s => s.access_token) || "";
    const { setMessage, setShow, setType } = useNotificationsStore()

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

    const [loading, setLoading] = useState(false);

    const handleSave = () => {

        setLoading(true);
        console.log('Saving permiso de viaje:');
        

        if (!fechaDesde) {
            setMessage('Fecha desde es requerida');
            setShow(true);
            setType('error');
            return;
        }

        if (!fechaHasta) {
            setMessage('Fecha hasta es requerida');
            setShow(true);
            setType('error');
            return;
        }

        if (createPermisoViaje) {
            createPermisoViaje.mutate({
                permisoViaje: {
                    asunto: tipoPermiso,
                    hora_recep: hora || moment().format("HH:mm"),
                    fec_ingreso: fechaIngreso ? moment(fechaIngreso).format('YYYY-MM-DD') : '',
                    referencia: motivo,
                    nom_comu: nomComunicarse,
                    tel_comu: telComunicarse,
                    email_comu: emailComunicarse,
                    via: via,
                    lugar_formu: lugarFormu,
                    fecha_desde: moment(fechaDesde).format('YYYY-MM-DD'),
                    fecha_hasta: moment(fechaHasta).format('YYYY-MM-DD'),
                    observacion: observacion,
                    nom_recep: '', // Add the recepcionist name if needed
                    documento: '', // Add the document if needed
                    num_crono: '', // Add the control number if needed
                    fecha_crono: fechaIngreso ? moment(fechaIngreso).format('YYYY-MM-DD') : '',
                    swt_est: '',
                    partida_e: '', // Add the partida if needed
                    sede_regis: '', // Add the registration seat if needed
                    qr: 0, // Add the QR code if needed
                },
                access
            }, {
                onSuccess: () => {
                    setMessage('Permiso de viaje creado exitosamente');
                    setShow(true);
                    setType('success');
                },
                onError: () => {
                    setMessage('Error al crear el permiso de viaje');
                    setShow(true);
                    setType('error');
                },
                onSettled: () => {
                    setLoading(false);
                }
            });
        }

        if (updatePermisoViaje && permisoViaje) {
            updatePermisoViaje.mutate({
                permisoViaje: {
                    ...permisoViaje,
                    asunto: tipoPermiso,
                    hora_recep: hora || moment().format("HH:mm"),
                    fec_ingreso: fechaIngreso ? moment(fechaIngreso).format('YYYY-MM-DD') : '',
                    referencia: motivo,
                    nom_comu: nomComunicarse,
                    tel_comu: telComunicarse,
                    email_comu: emailComunicarse,
                    via: via,
                    lugar_formu: lugarFormu,
                    fecha_desde: moment(fechaDesde).format('YYYY-MM-DD'),
                    fecha_hasta: moment(fechaHasta).format('YYYY-MM-DD'),
                    observacion: observacion,
                },
                access
            }, {
                onSuccess: () => {
                    setMessage('Permiso de viaje actualizado exitosamente');
                    setShow(true);
                    setType('success');
                },
                onError: () => {
                    setMessage('Error al actualizar el permiso de viaje');
                    setShow(true);
                    setType('error');
                },
                onSettled: () => {
                    setLoading(false);
                }
            });
        }
    }

  return (
    <>
    <div>
        <h2 className="text-lg font-semibold text-center mb-8">Formulario del Permiso de Viaje</h2>
        {/* <>{console.log('permisoViaje', permisoViaje)}</> */}
        <div className="grid grid-cols-8 gap-2">
            <button 
                onClick={handleSave}
                className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                {!loading && <Save className="text-xl"/>}
                <p className="text-xs">{loading ? 'Guardando...' : 'Guardar'}</p>
            </button>
            {permisoViaje && 
            <GenerarDocumento 
                name={permisoViaje.num_kardex}
                url={permisoViaje.asunto === '001' ? 'permiso-viaje-interior' : 'permiso-viaje-exterior'}
                params={{
                    id_viaje: permisoViaje.id_viaje.toString()
                }}
            />}
            <div className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                <FileText className="text-xl text-slate-50"/>
                <p className="text-xs">Ver Doc</p>
            </div>
            <div className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                <QrCode className="text-xl text-slate-950"/>
                <p className="text-xs">Generar QR</p>
            </div>
            <div className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                <FileWarning className="text-xl text-amber-500"/>
                <p className="text-xs">No Corre</p>
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
        <ParticipantesMain 
            viajeId={permisoViaje.id_viaje}
        />
    }
    </>
  )
}

export default PermisoForm