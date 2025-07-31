import { FileCog, FileText, FileWarning, QrCode, Save } from "lucide-react";
import { useState } from "react";
import SimpleInput from "../../../ui/SimpleInput";
import { IngresoPoderes } from "../../../../services/api/extraprotocolares/ingresoPoderes";
import TimePicker from "../../../ui/TimePicker";
import moment from "moment";
import { TIPO_PODERES } from "../../../../data/poderesFueraDeRegistro";
import SimpleSelectorStr from "../../../ui/SimpleSelectosStr";
import Calendar from "../../../ui/Calendar";
import { UseMutationResult } from "@tanstack/react-query";
import { CreateIngresoPoderesData } from "../../../../hooks/api/extraprotocolares/ingresoPoderes/useCreateIngresoPoderes";
import useAuthStore from "../../../../store/useAuthStore";
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore";
import { UpdateIngresoPoderesData } from "../../../../hooks/api/extraprotocolares/ingresoPoderes/UpdateIngresoPoderes";

interface Props {
    poder?: IngresoPoderes
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
    createIngresoPoderes?: UseMutationResult<IngresoPoderes, Error, CreateIngresoPoderesData>
    updateIngresoPoder: UseMutationResult<IngresoPoderes, Error, UpdateIngresoPoderesData>
}

const PoderesFueraDeRegistroForm = ({ poder, createIngresoPoderes, setOpen, updateIngresoPoder }: Props) => {

    const [loading, setLoading] = useState(false);
    const access = useAuthStore(s => s.access_token) || '';
    const { setMessage, setShow, setType } = useNotificationsStore()

    // poderes values
    const [hora, setHora] = useState<string | undefined>(
        poder?.hora_recep ? moment(poder.hora_recep, "HH:mm").format("HH:mm") : undefined
    );
    const [tipoPoder, setTipoPoder] = useState(poder?.id_asunto || '0');
    const [fechaIngreso, setFechaIngreso] = useState<Date | undefined>(
        poder?.fec_ingreso
        ? moment.utc(poder.fec_ingreso, "YYYY-MM-DD").hour(12).toDate()
        : undefined
    );
    const [referencia, setReferencia] = useState(poder?.referencia || '');
    const [nomComunicarse, setNomComunicarse] = useState(poder?.nom_comuni || '');
    const [telComunicarse, setTelComunicarse] = useState(poder?.telf_comuni || '');
    const [emailComunicarse, setEmailComunicarse] = useState(poder?.email_comuni || '');


    const handleSave = () => {

        if (tipoPoder === '0') {
            setMessage('Debe seleccionar un tipo de poder');
            setShow(true);
            setType('error');
            return;
        }

        if (!fechaIngreso) {
            setMessage('Debe seleccionar una fecha de ingreso');
            setShow(true);
            setType('error');
            return;
        }

        setLoading(true);

        if (createIngresoPoderes) {
            createIngresoPoderes.mutate({
                access,
                ingresoPoderes: {
                    nom_recep: poder?.nom_recep || '',
                    hora_recep: hora || '',
                    id_asunto: tipoPoder,
                    fec_ingreso: moment(fechaIngreso).format('YYYY-MM-DD'),
                    referencia,
                    nom_comuni: nomComunicarse,
                    telf_comuni: telComunicarse,
                    email_comuni: emailComunicarse,
                    documento: '0.00',
                    id_respon: '',
                    des_respon: '',
                    doc_presen: '',
                    fec_ofre: '',
                    hora_ofre: '',
                    fec_crono: moment().format('YYYY-MM-DD'),
                    swt_est: ''
                }
            }, {
                onSuccess: () => {
                    setMessage('Poder creado exitosamente');
                    setShow(true);
                    setType('success');
                    setOpen && setOpen(false);
                },
                onError: (error) => {
                    setMessage(`Error al crear poder: ${error.message}`);
                    setShow(true);
                    setType('error');
                },
                onSettled: () => {
                    setLoading(false);
                }
            });
        }

        if (updateIngresoPoder && poder) {
            updateIngresoPoder.mutate({
                access,
                ingresoPoderes: {
                    nom_recep: poder.nom_recep,
                    hora_recep: poder.hora_recep,
                    id_asunto: tipoPoder,
                    fec_ingreso: poder.fec_ingreso,
                    referencia,
                    nom_comuni: nomComunicarse,
                    telf_comuni: telComunicarse,
                    email_comuni: emailComunicarse,
                    documento: poder.documento,
                    id_respon: poder.id_respon,
                    des_respon: poder.des_respon,
                    doc_presen: poder.doc_presen,
                    fec_ofre: poder.fec_ofre,
                    hora_ofre: poder.hora_ofre,
                    fec_crono: poder.fec_crono,
                    swt_est: poder.swt_est
                }
            }, {
                onSuccess: () => {
                    setMessage('Poder actualizado exitosamente');
                    setShow(true);
                    setType('success');
                    setOpen && setOpen(false);
                },
                onError: (error) => {
                    setMessage(`Error al actualizar poder: ${error.message}`);
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
    <div>
        <h2 className="text-lg font-semibold text-center mb-8">Formulario Ingreso de Poderes</h2>
        {/* <>{console.log('permisoViaje', permisoViaje)}</> */}
        <div className="grid grid-cols-8 gap-2">
            <>{console.log('fechaIngreso poder', poder?.fec_ingreso)}</>
            <>{console.log('fechaIngreso state', fechaIngreso)}</>
            <button 
                onClick={handleSave}
                className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                {!loading && <Save className="text-xl"/>}
                <p className="text-xs">{loading ? 'Guardando...' : 'Guardar'}</p>
            </button>
            <div className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                <FileCog className="text-xl text-green-600"/>
                <p className="text-xs">Generar</p>
            </div>
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
                value={poder?.num_formu || ''}
                setValue={() => {}}
                horizontal
                disabled
            />
            <TimePicker
                selectedTime={hora}
                setSelectedTime={setHora}
            />
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleSelectorStr 
                label="Tipo de Poder"
                defaultValue={tipoPoder}
                setter={setTipoPoder}
                options={[{ value: '0', label: 'Seleccionar Poder' }, ...TIPO_PODERES.map(p => ({ value: p.id_asunto, label: p.des_asunto }))]}
            />
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
                label="Referencia"
                value={referencia}
                setValue={setReferencia}
                horizontal
                fullWidth
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
        </div>
                <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleInput 
                label="Responsable"
                value={'ADMINISTRADOR CNL'}
                setValue={() => {}}
                horizontal
                disabled
            />
        </div>
    </div>
  )
}

export default PoderesFueraDeRegistroForm