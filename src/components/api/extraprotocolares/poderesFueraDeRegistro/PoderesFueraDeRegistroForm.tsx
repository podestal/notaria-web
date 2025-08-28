import { FileWarning, QrCode, Save } from "lucide-react";
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
import useUpdateIngresoPoderes, { UpdateIngresoPoderesData } from "../../../../hooks/api/extraprotocolares/ingresoPoderes/UpdateIngresoPoderes";
import ContratantesMain from "./contratantes/ContratantesMain";
import useUserInfoStore from "../../../../hooks/store/useGetUserInfo";
import GenerarDocumento from "../documentos/GenerarDocumento";
import AbrirDocumento from "../documentos/AbrirDocumento";
import EssaludForm from "./poderTypeForms/EssaludForm";
import CreatePoderRegistro from "./CreatePoderRegistro";
import CreatePension from "./CreatePension";
import PoderFueraDeRegistroNoCorre from "./PoderFueraDeRegistroNoCorre";

interface Props {
    poder?: IngresoPoderes
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>
    createIngresoPoderes?: UseMutationResult<IngresoPoderes, Error, CreateIngresoPoderesData>
    updateIngresoPoder?: UseMutationResult<IngresoPoderes, Error, UpdateIngresoPoderesData>
}

const PoderesFueraDeRegistroForm = ({ poder, createIngresoPoderes, updateIngresoPoder }: Props) => {

    const [loading, setLoading] = useState(false);
    const access = useAuthStore(s => s.access_token) || '';
    const { setMessage, setShow, setType } = useNotificationsStore()
    const [idPoder, setIdPoder] = useState(poder?.id_poder || 0);
    const user = useUserInfoStore(s => s.user);

    // poderes values
    const [hora, setHora] = useState<string | undefined>(
        poder?.hora_recep ? moment(poder.hora_recep, "HH:mm").format("HH:mm") : undefined
    );
    const [tipoPoder, setTipoPoder] = useState(poder?.id_asunto || '0');
    const [fechaIngreso, setFechaIngreso] = useState<Date | undefined>(
        poder?.fec_ingreso
        ? moment.utc(poder.fec_ingreso, "YYYY-MM-DD").hour(12).toDate()
        : moment().toDate()
    );
    const [referencia, setReferencia] = useState(poder?.referencia || '');
    const [nomComunicarse, setNomComunicarse] = useState(poder?.nom_comuni || '');
    const [telComunicarse, setTelComunicarse] = useState(poder?.telf_comuni || '');
    const [emailComunicarse, setEmailComunicarse] = useState(poder?.email_comuni || '');

    const urlDocumento = poder ? 
    poder?.id_asunto === '002' ? 'poder-fuera-registro' : poder?.id_asunto === '003' ? 'poder-onp' : poder?.id_asunto === '004' ? 'poder-essalud' : 'cert-domiciliario' :
    tipoPoder === '002' ? 'poder-fuera-registro' : tipoPoder === '003' ? 'poder-onp' : tipoPoder === '004' ? 'poder-essalud' : 'cert-domiciliario';
    const [showDocs, setShowDocs] = useState(poder ? true : false);
    const [numPoder, setNumPoder] = useState(poder?.num_kardex || '');

    const [doneCreate, setDoneCreate] = useState(false);
    const updatePoderInternal = useUpdateIngresoPoderes({ page: 1, ingresoPoderesId: idPoder })
    const [noCorre, setNoCorre] = useState(poder?.swt_est === 'NC' ? true : false);

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

        if (createIngresoPoderes && !doneCreate) {
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
                    id_respon: `${user?.last_name} ${user?.first_name}`.trim(),
                    des_respon: `${user?.last_name} ${user?.first_name}`.trim(),
                    doc_presen: '',
                    fec_ofre: moment(fechaIngreso).format('DD/MM/YYYY'),
                    hora_ofre: hora || '',
                    fec_crono: moment().format('YYYY-MM-DD'),
                    swt_est: null
                }
            }, {
                onSuccess: res => {
                    setMessage('Poder creado exitosamente');
                    setShow(true);
                    setType('success');
                    setIdPoder(res.id_poder);
                    setNumPoder(res.num_kardex);
                    setShowDocs(true);
                    setDoneCreate(true);
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
                    nom_recep: poder?.nom_recep || '',
                    hora_recep: hora || '',
                    id_asunto: tipoPoder,
                    fec_ingreso: moment(fechaIngreso).format('YYYY-MM-DD'),
                    referencia,
                    nom_comuni: nomComunicarse,
                    telf_comuni: telComunicarse,
                    email_comuni: emailComunicarse,
                    documento: '0.00',
                    id_respon: poder.id_respon,
                    des_respon: poder.des_respon,
                    doc_presen: '',
                    fec_ofre: poder.fec_ofre,
                    hora_ofre: poder.hora_ofre,
                    fec_crono: moment().format('YYYY-MM-DD'),
                    swt_est: poder.swt_est
                }
            }, {
                onSuccess: () => {
                    setMessage('Poder actualizado exitosamente');
                    setShow(true);
                    setType('success');
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

        if (!poder && doneCreate) {
            updatePoderInternal.mutate({
                access,
                ingresoPoderes: {
                    nom_recep: '',
                    hora_recep: hora || '',
                    id_asunto: tipoPoder,
                    fec_ingreso: moment(fechaIngreso).format('YYYY-MM-DD'),
                    referencia,
                    nom_comuni: nomComunicarse,
                    telf_comuni: telComunicarse,
                    email_comuni: emailComunicarse,
                    documento: '0.00',
                    id_respon: `${user?.last_name} ${user?.first_name}`.trim(),
                    des_respon: `${user?.last_name} ${user?.first_name}`.trim(),
                    doc_presen: '',
                    fec_ofre: moment(fechaIngreso).format('DD/MM/YYYY'),
                    hora_ofre: hora || '',
                    fec_crono: moment().format('YYYY-MM-DD'),
                    swt_est: null
                }
            }, {
                onSuccess: () => {
                    setMessage('Poder actualizado exitosamente');
                    setShow(true);
                    setType('success');
                },
                onError: (error) => {
                    setMessage(`Error al actualizar poder: ${error.message}`);
                    setShow(true);
                    setType('error');
                },
                onSettled: () => {
                    setLoading(false);
                }
            })
        }
    }

  return (
    <>
    <div>
        {noCorre && (
            <div className="absolute inset-0 z-50 flex items-center justify-center mt-12 backdrop-blur-xs rounded-lg">
                <div className="text-center">
                    <div className="bg-amber-600 text-white px-8 py-4 rounded-lg shadow-2xl transform -rotate-12 scale-110">
                        <h3 className="text-2xl font-bold tracking-wider">NO CORRESPONDE</h3>
                        <p className="text-amber-100 text-sm mt-1">Documento no aplicable</p>
                    </div>
                </div>
            </div>
        )}
        <h2 className="text-lg font-semibold text-center mb-8">Formulario Ingreso de Poderes</h2>
        <div className="grid grid-cols-8 gap-2">
            {!noCorre && <button 
                onClick={handleSave}
                className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                {!loading && <Save className="text-xl"/>}
                <p className="text-xs">{loading ? 'Guardando...' : 'Guardar'}</p>
            </button>}
            {showDocs && 
            <GenerarDocumento 
                name={`__PODER__${idPoder}-${(numPoder || '').slice(0, 4)}.docx`}
                url={urlDocumento}
                params={{
                    id_poder: idPoder.toString(),
                    action: 'generate'
                }}
            />}
            {showDocs && <AbrirDocumento 
                name={`__PODER__${idPoder}-${(numPoder || '').slice(0, 4)}.docx`}
                url={urlDocumento}
                params={{
                    id_poder: idPoder.toString(),
                    action: 'retrieve'
                }}
            />}
            {/* <div className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                <QrCode className="text-xl text-slate-950"/>
                <p className="text-xs">Generar QR</p>
            </div> */}
            {poder && <PoderFueraDeRegistroNoCorre
                page={1}
                poderFueraDeRegistro={poder}
                setNoCorre={setNoCorre}
            />}
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
                value={poder?.id_respon || `${user?.first_name} ${user?.last_name}`.trim()}
                setValue={() => {}}
                horizontal
                disabled
            />
        </div>
        <>{console.log('idPoder', idPoder)}</>
        <>{console.log('tipoPoder', tipoPoder)}</>
        {idPoder > 0 && (
            <div className="w-full flex justify-center items-center gap-4 my-8">
                <ContratantesMain idPoder={idPoder} />
                {(tipoPoder === '002') && <CreatePoderRegistro poderId={idPoder} />}
                {(tipoPoder === '003') && <CreatePension poderId={idPoder} />}
                {(tipoPoder === '004') && <EssaludForm poderId={idPoder} />}
            </div>
        )}
    </div>
    </>
  )
}

export default PoderesFueraDeRegistroForm