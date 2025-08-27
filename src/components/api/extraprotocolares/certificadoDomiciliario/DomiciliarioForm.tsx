import { useState } from "react";
import { Domiciliario } from "../../../../services/api/extraprotocolares/domiciliarioService";
import { Save } from "lucide-react";
import AbrirDocumento from "../documentos/AbrirDocumento";
import GenerarDocumento from "../documentos/GenerarDocumento";
import SimpleInput from "../../../ui/SimpleInput";
import Calendar from "../../../ui/Calendar";
import moment from "moment";
import SolicitanteMain from "./solicitante/SolicitanteMain";
import DateInput from "../../../ui/DateInput";
import SimpleSelectorStr from "../../../ui/SimpleSelectosStr";
import { documentNaturalOptions } from "../../../../data/clienteData";
import SimpleSelector from "../../../ui/SimpleSelector";
import { UseMutationResult } from "@tanstack/react-query";
import useAuthStore from "../../../../store/useAuthStore";
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore";
import useUserInfoStore from "../../../../hooks/store/useGetUserInfo";
import { CreateDomiciliarioData } from "../../../../hooks/api/extraprotocolares/domiciliario/useCreateDomiciliario";
import useUpdateDomiciliario, { UpdateDomiciliarioData } from "../../../../hooks/api/extraprotocolares/domiciliario/useUpdateDomiciliario";

interface Props {
    domiciliario?: Domiciliario;
    createDomiciliario?: UseMutationResult<Domiciliario, Error, CreateDomiciliarioData>
    updateDomiciliario?: UseMutationResult<Domiciliario, Error, UpdateDomiciliarioData>
}

const DomiciliarioForm = ({ domiciliario, createDomiciliario, updateDomiciliario }: Props) => {

    const [loading, setLoading] = useState(false);
    const user = useUserInfoStore(s => s.user)
    const access = useAuthStore(s => s.access_token) || '';
    const { setMessage, setShow, setType } = useNotificationsStore()

    const [numCertificado, setNumCertificado] = useState(domiciliario?.num_certificado || '');
    const [numFormulario, setNumFormulario] = useState(domiciliario?.num_formu || '');
    const [fechaIngreso, setFechaIngreso] = useState<Date | undefined>(
        domiciliario?.fec_ingreso
        ? moment.utc(domiciliario.fec_ingreso, "YYYY-MM-DD").hour(12).toDate()
        : (new Date())
    );

    const [selectedTipoDocumento, setSelectedTipoDocumento] = useState(1);
    const [document, setDocument] = useState(domiciliario?.numdoc_solic || '');

    const [solicitante, setSolicitante] = useState(domiciliario?.nombre_solic || '');
    const [domicilio, setDomicilio] = useState(domiciliario?.domic_solic || '');
    const [distrito, setDistrito] = useState(domiciliario?.distrito_solic || '');
    const [profesion, setProfesion] = useState(domiciliario?.detprofesionc || '');
    const [estadoCivil, setEstadoCivil] = useState(domiciliario?.idestcivil || 0);
    const [genero, setGenero] = useState(domiciliario?.sexo || '');

    const [motivo, setMotivo] = useState(domiciliario?.motivo_solic || '');
    const [fechaOcupacion, setFechaOcupacion] = useState(domiciliario?.fecha_ocupa ? moment(domiciliario.fecha_ocupa).format('DD/MM/YYYY') : moment().format('DD/MM/YYYY'));
    const [condicion, setCondicion] = useState(domiciliario?.declara_ser || '');
    const [propietario, setPropietario] = useState(domiciliario?.propietario || '');
    const [recibido, setRecibido] = useState(domiciliario?.recibido || '');
    const [reciboEmpresa, setReciboEmpresa] = useState(domiciliario?.recibo_empresa || '');
    const [numRecibo, setNumRecibo] = useState(domiciliario?.numero_recibo || '');
    const [mesFacturado, setMesFacturado] = useState(domiciliario?.mes_facturado || '');
    const [textoCuerpo, setTextoCuerpo] = useState(domiciliario?.texto_cuerpo || '');
    const [testigoTipoDocumento, setTestigoTipoDocumento] = useState(domiciliario?.tdoc_testigo ? parseInt(domiciliario.tdoc_testigo) : 1);
    const [testigoDocument, setTestigoDocument] = useState(domiciliario?.ndocu_testigo || '');
    const [nomTestigo, setNomTestigo] = useState(domiciliario?.nom_testigo || '');

    const [showDocs, setShowDocs] = useState(domiciliario ? true : false);
    const [domiciliarioId, setDomiciliarioId] = useState(domiciliario?.id_domiciliario || 0);

    const [doneCreate, setDoneCreate] = useState(false);
    const updateDomiciliarioInternal = useUpdateDomiciliario({ page: 1, domiciliarioId: domiciliarioId })

    const handleSave = () => {
        setLoading(true);
        if (createDomiciliario && !doneCreate) {
        createDomiciliario.mutate({
            access,
            domiciliario: {
                num_formu: numFormulario,
                fec_ingreso: fechaIngreso ? moment(fechaIngreso).format('YYYY-MM-DD') : '',
                numdoc_solic: document,
                nombre_solic: solicitante,
                domic_solic: domicilio,
                distrito_solic: distrito,
                motivo_solic: motivo,
                fecha_ocupa: fechaOcupacion ? moment(fechaOcupacion, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
                declara_ser: condicion,
                propietario,
                recibido,
                tdoc_testigo: testigoTipoDocumento !== 0 ? `0${testigoTipoDocumento}` : '0',
                tipdoc_solic: selectedTipoDocumento !== 0 ? `0${selectedTipoDocumento}` : '0',
                texto_cuerpo: textoCuerpo,
                justifi_cuerpo: '',
                nom_testigo: nomTestigo,
                ndocu_testigo: testigoDocument,
                idestcivil: estadoCivil,
                sexo: genero,
                detprofesionc: profesion,
                profesionc: profesion,
                especificacion: '',
                recibo_empresa: reciboEmpresa,
                numero_recibo: numRecibo,
                mes_facturado: mesFacturado,
                idusuario: user?.idusuario || 0,
            }
        }, {
            onSuccess: res => {
                setMessage('Domiciliario creado exitosamente');
                setShow(true);
                setType('success');
                setShowDocs(true);
                setDomiciliarioId(res.id_domiciliario);
                setNumCertificado(res.num_certificado);
                setDoneCreate(true);
            },
            onError: () => {
                setMessage('Error al crear el domiciliario');
                setShow(true);
                setType('error');
            },
            onSettled: () => {
                setLoading(false);
            }
        })
    }

        updateDomiciliario && updateDomiciliario.mutate({
            access,
            domiciliario: {
                num_formu: numFormulario,
                fec_ingreso: fechaIngreso ? moment(fechaIngreso).format('YYYY-MM-DD') : '',
                numdoc_solic: document,
                nombre_solic: solicitante,
                domic_solic: domicilio,
                distrito_solic: distrito,
                motivo_solic: motivo,
                fecha_ocupa: fechaOcupacion ? moment(fechaOcupacion, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
                declara_ser: condicion,
                propietario,
                recibido,
                tdoc_testigo: testigoTipoDocumento !== 0 ? `0${testigoTipoDocumento}` : '0',
                tipdoc_solic: selectedTipoDocumento !== 0 ? `0${selectedTipoDocumento}` : '0',
                texto_cuerpo: textoCuerpo,
                justifi_cuerpo: '',
                nom_testigo: nomTestigo,
                ndocu_testigo: testigoDocument,
                idestcivil: estadoCivil,
                sexo: genero,
                detprofesionc: profesion,
                profesionc: profesion,
                especificacion: '',
                recibo_empresa: reciboEmpresa,
                numero_recibo: numRecibo,
                mes_facturado: mesFacturado,
                idusuario: user?.idusuario || 0,
            }
        }, {
            onSuccess: () => {
                setMessage('Domiciliario actualizado exitosamente');
                setShow(true);
                setType('success');
            },
            onError: () => {
                setMessage('Error al actualizar el domiciliario');
                setShow(true);
                setType('error');
            },
            onSettled: () => {
                setLoading(false);
            }
        })

        if (!domiciliario && doneCreate) {
            updateDomiciliarioInternal.mutate({
                access,
                domiciliario: {
                    num_formu: numFormulario,
                    fec_ingreso: fechaIngreso ? moment(fechaIngreso).format('YYYY-MM-DD') : '',
                    numdoc_solic: document,
                    nombre_solic: solicitante,
                    domic_solic: domicilio,
                    distrito_solic: distrito,
                    motivo_solic: motivo,
                    fecha_ocupa: fechaOcupacion ? moment(fechaOcupacion, 'DD/MM/YYYY').format('YYYY-MM-DD') : '',
                    declara_ser: condicion,
                    propietario,
                    recibido,
                    tdoc_testigo: testigoTipoDocumento !== 0 ? `0${testigoTipoDocumento}` : '0',
                    tipdoc_solic: selectedTipoDocumento !== 0 ? `0${selectedTipoDocumento}` : '0',
                    texto_cuerpo: textoCuerpo,
                    justifi_cuerpo: '',
                    nom_testigo: nomTestigo,
                    ndocu_testigo: testigoDocument,
                    idestcivil: estadoCivil,
                    sexo: genero,
                    detprofesionc: profesion,
                    profesionc: profesion,
                    especificacion: '',
                    recibo_empresa: reciboEmpresa,
                    numero_recibo: numRecibo,
                    mes_facturado: mesFacturado,
                    idusuario: user?.idusuario || 0,
                }
            }, {
                onSuccess: () => {
                    setMessage('Domiciliario actualizado exitosamente');
                    setShow(true);
                    setType('success');
                },
                onError: () => {
                    setMessage('Error al actualizar el domiciliario');
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
    <div>
        <h2 className="text-lg font-semibold text-center mb-8">Formulario Cartas Notariales</h2>
        {/* <>{console.log('permisoViaje', permisoViaje)}</> */}
        <div className="grid grid-cols-8 gap-2">
            <button 
                onClick={handleSave}
                className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                {!loading && <Save className="text-xl"/>}
                <p className="text-xs">{loading ? 'Guardando...' : 'Guardar'}</p>
            </button>
            {showDocs && 
            <GenerarDocumento 
                name={`__CDOM__${numCertificado.slice(-6)}-${numCertificado.slice(0, 4)}.docx`}
                url='cert-domiciliario'
                params={{
                    id_domiciliario: domiciliarioId.toString() || '',
                    action: 'generate'
                }}
            />}
            {showDocs && 
            <AbrirDocumento 
                name={`__CDOM__${numCertificado.slice(-6)}-${numCertificado.slice(0, 4)}.docx`}
                url='cert-domiciliario'
                params={{
                    id_domiciliario: domiciliarioId.toString(),
                    action: 'retrieve'
                }}
            />}
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleInput
                label="Num Certificado"
                value={numCertificado}
                setValue={setNumCertificado}
                horizontal
                disabled
            />
            <SimpleInput
                label="Num Formulario"
                value={numFormulario}
                setValue={setNumFormulario}
                horizontal
                disabled
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
        </div>
        <p className="w-full border-b-1 border-slate-300 my-4 pb-2 text-md font-semibold text-center">Solicitante</p>
        <SolicitanteMain 
            solicitante={solicitante}
            domicilio={domicilio}
            distrito={distrito}
            profesion={profesion}
            estadoCivil={estadoCivil}
            genero={genero}
            setSolicitante={setSolicitante}
            setDomicilio={setDomicilio}
            setDistrito={setDistrito}
            setProfesion={setProfesion}
            setEstadoCivil={setEstadoCivil}
            setGenero={setGenero}
            selectedTipoDocumento={selectedTipoDocumento}
            setSelectedTipoDocumento={setSelectedTipoDocumento}
            document={document}
            setDocument={setDocument}
        />
        <div className="w-[80%] flex justify-center items-start flex-col gap-4 my-4">
            <SimpleInput
                label="Motivo"
                value={motivo}
                setValue={setMotivo}
                horizontal
                fullWidth
            />
            <DateInput 
                label="Fecha de ocupación"
                value={fechaOcupacion}
                setValue={setFechaOcupacion}
                horizontal
            />
            <SimpleSelectorStr 
                label="Declara ser"
                options={[
                    {label: 'Seleccione una opción', value: ''},
                    {label: 'INQUILINO', value: 'INQUILINO'}, 
                    {label: 'PROPIETARIO', value: 'PROPIETARIO'}
                ]}
                setter={setCondicion}
                defaultValue={condicion}
            />
            <SimpleInput
                label="Propietario"
                value={propietario}
                setValue={setPropietario}
                horizontal
                fullWidth
            />
            <SimpleInput
                label="Recibido por"
                value={recibido}
                setValue={setRecibido}
                horizontal
                fullWidth
            />
            <SimpleSelectorStr 
                label="Recibo empresa"
                options={[
                    {label: 'Seleccione una opción', value: ''},
                    {label: 'SEDA JULIACA S.A.', value: 'SEDA JULIACA S.A.'}, 
                    {label: 'ELECTRO PUNO S.A.A', value: 'ELECTRO PUNO S.A.A'}
                ]}
                setter={setReciboEmpresa}
                defaultValue={reciboEmpresa}
            />
            <SimpleInput
                label="Número de recibo"
                value={numRecibo}
                setValue={setNumRecibo}
                horizontal
                fullWidth
            />
            <SimpleSelectorStr 
                label="Mes facturado"
                options={[{label: 'Seleccione una opción', value: ''}, {label: 'ENERO', value: 'ENERO'}, {label: 'FEBRERO', value: 'FEBRERO'}, {label: 'MARZO', value: 'MARZO'}, {label: 'ABRIL', value: 'ABRIL'}, {label: 'MAYO', value: 'MAYO'}, {label: 'JUNIO', value: 'JUNIO'}, {label: 'JULIO', value: 'JULIO'}, {label: 'AGOSTO', value: 'AGOSTO'}, {label: 'SEPTIEMBRE', value: 'SEPTIEMBRE'}, {label: 'OCTUBRE', value: 'OCTUBRE'}, {label: 'NOVIEMBRE', value: 'NOVIEMBRE'}, {label: 'DICIEMBRE', value: 'DICIEMBRE'}]}
                setter={setMesFacturado}
                defaultValue={mesFacturado}
            />
        </div>
        <p className="w-full border-b-1 border-slate-300 my-4 pb-2 text-md font-semibold text-center">Cuerpo</p>
        <div className="flex gap-4 justify-center items-center my-4">
            <p className="pl-2 text-xs font-semibold text-slate-700">Cuerpo</p>
            <textarea
                value={textoCuerpo}
                onChange={(e) => setTextoCuerpo(e.target.value)}
                placeholder="Contenido de la carta"
                className="w-full h-32 p-2 border border-slate-300 rounded"
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleSelector 
                label="Tipo de documento"
                options={documentNaturalOptions}
                setter={setTestigoTipoDocumento}
                defaultValue={testigoTipoDocumento}
            />
            <SimpleInput
                label="Número de documento"
                value={testigoDocument}
                setValue={setTestigoDocument}
                horizontal
            />
        </div>
        <div className="w-[80%] flex justify-center items-start flex-col gap-4 my-4">
            <SimpleInput
                label="Testigo a ruego"
                value={nomTestigo}
                setValue={setNomTestigo}
                horizontal
                fullWidth
            />
        </div>
    </div>
  )
}

export default DomiciliarioForm