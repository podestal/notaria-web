import { MessageCircleQuestionIcon, Save } from "lucide-react";
import { useState } from "react";
import SimpleInput from "../../../ui/SimpleInput";
import { IngresoCartas } from "../../../../services/api/extraprotocolares/ingresoCartas";
import moment from "moment";
import Calendar from "../../../ui/Calendar";

import { ALL_DOCUMENTS_OPTIONS } from "../../../../data/clienteData";
import SimpleSelector from "../../../ui/SimpleSelector";
import SearchableDropdownInput from "../../../ui/SearchableDropdownInput";
import { Ubigeo } from "../../../../services/api/ubigeoService";
import TimePicker from "../../../ui/TimePicker";
import { Usuario } from "../../../../services/api/usuariosService";
import SimpleSelectorStr from "../../../ui/SimpleSelectosStr";
import { CreateIngresoCartaData } from "../../../../hooks/api/extraprotocolares/ingresoCartas/useCreateIngresoCarta";
import { UseMutationResult } from "@tanstack/react-query";
import useAuthStore from "../../../../store/useAuthStore";
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore";
import useGetUserInfo from "../../../../hooks/store/useGetUserInfo";
import GenerarDocumento from "../documentos/GenerarDocumento";
import AbrirDocumento from "../documentos/AbrirDocumento";
import useUpdateIngresoCarta from "../../../../hooks/api/extraprotocolares/ingresoCartas/useUpdateIngresoCarta";
import TopModal from "../../../ui/TopModal";
import SellosMain from "./sellos/SellosMain";

interface Props {
    carta?: IngresoCartas;
    ubigeos: Ubigeo[]
    usuarios: Usuario[]
    createIngresoCarta?: UseMutationResult<IngresoCartas, Error, CreateIngresoCartaData>
    updateCartaNotarial?: UseMutationResult<IngresoCartas, Error, CreateIngresoCartaData>
}

const CartasNotarialesForm = ({ carta, ubigeos, usuarios, createIngresoCarta, updateCartaNotarial }: Props) => {

    const [loading, setLoading] = useState(false);
    const access = useAuthStore(s => s.access_token) || '';
    const { setMessage, setShow, setType } = useNotificationsStore()
    const user = useGetUserInfo(s => s.user);
    const [openSellos, setOpenSellos] = useState(false);


    const [numCarta, setNumCarta] = useState(carta?.num_carta || '');
    const [fechaIngreso, setFechaIngreso] = useState<Date | undefined>(
        carta?.fec_ingreso
        ? moment.utc(carta.fec_ingreso, "YYYY-MM-DD").hour(12).toDate()
        : (new Date())
    );

    // State for Remitente

    const [tipoDocumento, setTipoDocumento] = useState(1);
    const [documento, setDocumento] = useState(carta?.id_remitente || '');
    const [telefono, setTelefono] = useState(carta?.telf_remitente || '');
    const [remitente, setRemitente] = useState(carta?.nom_remitente || '');
    const [direccion, setDireccion] = useState(carta?.dir_remitente || '');

    // State for Destinatario
    const [tipoDocumentoDest, setTipoDocumentoDest] = useState(1);
    const [documentoDest, setDocumentoDest] = useState(carta?.dni_destinatario || '');
    const [destinatario, setDestinatario] = useState(carta?.nom_destinatario || '');
    const [direccionDest, setDireccionDest] = useState(carta?.dir_destinatario || '');
    const [ubigeo, setUbigeo] = useState<{ id: string; label: string } | null>(() => {
        if (carta && carta.zona_destinatario) {
          const match = ubigeos.find(ubi => ubi.coddis === carta.zona_destinatario);
          if (match) {
            return {
              id: match.coddis,
              label: `${match.nomdpto} - ${match.nomprov} - ${match.nomdis}`,
            };
          }
        }
        return null;
      });

    // State for Diligencia
    const [fechaDiligencia, setFechaDiligencia] = useState<Date | undefined>(carta?.fec_entrega ? moment.utc(carta.fec_entrega, "YYYY-MM-DD").hour(12).toDate() : new Date());
    const [horaDiligencia, setHoraDiligencia] = useState<string | undefined>(carta?.hora_entrega || undefined);
    const [responsible, setResponsible] = useState<string>(carta?.emple_entrega || '');
    const [firma, setFirma] = useState<string>(carta?.firmo || 'si');
    const [recepcion, setRecepcion] = useState<string>(carta?.recepcion || '');
    const [contenido, setContenido] = useState<string>(carta?.conte_carta || '');

    const [showDocs, setShowDocs] = useState(carta ? true : false);
    const [cartaId, setCartaId] = useState(carta?.id_carta || 0);

    const [doneCreate, setDoneCreate] = useState(false);
    const updateCartaNotarialInternal = useUpdateIngresoCarta({ ingresoCartasId: cartaId })


    const handleSave = () => {
        setLoading(true);

        if (createIngresoCarta && !doneCreate) {
            createIngresoCarta.mutate({
                access,
                ingresoCarta: {
                    fec_ingreso: moment(fechaIngreso).format('DD/MM/YYYY'),
                    id_remitente: documento,
                    telf_remitente: telefono,
                    nom_remitente: remitente,
                    dir_remitente: direccion,
                    dni_destinatario: documentoDest,
                    nom_destinatario: destinatario,
                    dir_destinatario: direccionDest,
                    zona_destinatario: ubigeo?.id || '',
                    fec_entrega: moment(fechaDiligencia).format('DD/MM/YYYY'),
                    hora_entrega: horaDiligencia || '',
                    emple_entrega: responsible,
                    firmo: firma,
                    recepcion,
                    conte_carta: contenido,
                    costo: '0.00', // Assuming costo is not provided in the form
                    id_encargado: `${user?.first_name} ${user?.last_name}`,
                    des_encargado: 'Encargado de la carta',
                    nom_regogio: '',
                    doc_recogio: '',
                    fec_recogio: moment(fechaIngreso).format('DD/MM/YYYY'), // Assuming this is the same as fec_ingreso
                    fact_recogio: '0.00',
                }
            }, {
                onSuccess: res => {
                    // Optionally reset the form or show a success message
                    setMessage('Carta guardada exitosamente');
                    setShow(true);
                    setType('success');
                    setShowDocs(true);
                    setCartaId(res.id_carta);
                    setNumCarta(res.num_carta);
                    setDoneCreate(true);
                },
                onError: (error) => {
                    console.error("Error creating carta:", error);
                    setMessage('Error al guardar la carta');
                    setShow(true);
                    setType('error');
                },
                onSettled: () => {
                    setLoading(false);
                }
            });
        }

        if (updateCartaNotarial) {
            updateCartaNotarial.mutate({
                access,
                ingresoCarta: {
                    fec_ingreso: moment(fechaIngreso).format('DD/MM/YYYY'),
                    id_remitente: documento,
                    telf_remitente: telefono,
                    nom_remitente: remitente,
                    dir_remitente: direccion,
                    dni_destinatario: documentoDest,
                    nom_destinatario: destinatario,
                    dir_destinatario: direccionDest,
                    zona_destinatario: ubigeo?.id || '',
                    fec_entrega: moment(fechaDiligencia).format('DD/MM/YYYY'),
                    hora_entrega: horaDiligencia || '',
                    emple_entrega: responsible,
                    firmo: firma,
                    recepcion,
                    conte_carta: contenido,
                    costo: '0.00', // Assuming costo is not provided in the form
                    id_encargado: responsible,
                    des_encargado: 'Encargado de la carta',
                    nom_regogio: '',
                    doc_recogio: '',
                    fec_recogio: moment(fechaIngreso).format('DD/MM/YYYY'), // Assuming this is the same as fec_ingreso
                    fact_recogio: '0.00',
                }
            }, {
                onSuccess: () => {
                    setMessage('Carta actualizada exitosamente');
                    setShow(true);
                    setType('success');
                },
                onError: (error) => {
                    console.error("Error updating carta:", error);
                    setMessage('Error al actualizar la carta');
                    setShow(true);
                    setType('error');
                },
                onSettled: () => {
                    setLoading(false);
                }
            });
        }

        if (!carta && doneCreate) {
            updateCartaNotarialInternal.mutate({
                access,
                ingresoCarta: {
                    fec_ingreso: moment(fechaIngreso).format('DD/MM/YYYY'),
                    id_remitente: documento,
                    telf_remitente: telefono,
                    nom_remitente: remitente,
                    dir_remitente: direccion,
                    dni_destinatario: documentoDest,
                    nom_destinatario: destinatario,
                    dir_destinatario: direccionDest,
                    zona_destinatario: ubigeo?.id || '',
                    fec_entrega: moment(fechaDiligencia).format('DD/MM/YYYY'),
                    hora_entrega: horaDiligencia || '',
                    emple_entrega: responsible,
                    firmo: firma,
                    recepcion,
                    conte_carta: contenido,
                    costo: '0.00', // Assuming costo is not provided in the form
                    id_encargado: responsible,
                    des_encargado: 'Encargado de la carta',
                    nom_regogio: '',
                    doc_recogio: '',
                    fec_recogio: moment(fechaIngreso).format('DD/MM/YYYY'), // Assuming this is the same as fec_ingreso
                    fact_recogio: '0.00',
                }
            }, {
                onSuccess: () => {
                    setMessage('Carta actualizada exitosamente');
                    setShow(true);
                    setType('success');
                },
                onError: () => {
                    setMessage('Error al actualizar la carta');
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
                name={`__CARTA__${numCarta.slice(-6)}-${numCarta.slice(0, 4)}.docx`}
                url='carta-notarial'
                params={{
                    id_carta: cartaId.toString()
                }}
            />}
            {showDocs && 
            <AbrirDocumento 
                name={`__CARTA__${numCarta.slice(-6)}-${numCarta.slice(0, 4)}.docx`}
                url='carta-notarial'
                params={{
                    id_carta: cartaId.toString(),
                    action: 'retrieve'
                }}
            />}
            {/* <div className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                <QrCode className="text-xl text-slate-950"/>
                <p className="text-xs">Generar QR</p>
            </div> */}
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleInput 
                label="Num Carta"
                value={numCarta}
                setValue={setNumCarta}
                horizontal
                disabled
            />
            <SimpleInput 
                label="Responsable"
                value={carta?.id_encargado || `${user?.first_name} ${user?.last_name}`.trim()}
                setValue={() => {}}
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
        <p className="w-full border-b-1 border-slate-300 my-4 pb-2 text-md font-semibold text-center">Remitente</p>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleSelector
                label="Tipo de Documento"
                options={ALL_DOCUMENTS_OPTIONS}
                defaultValue={tipoDocumento}
                setter={setTipoDocumento}
            />
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleInput
                label="Número de Documento"
                value={documento}
                setValue={setDocumento}
                horizontal
            />
            <SimpleInput
                label="Teléfono"
                value={telefono}
                setValue={setTelefono}
                horizontal
            />
        </div>
        <div className="grid grid-cols-1 gap-4 my-4">
            <SimpleInput
                label="Remitente"
                value={remitente}
                setValue={setRemitente}
                horizontal
                fullWidth
            />
        </div>
        <div className="grid grid-cols-1 gap-4 my-4">
            <SimpleInput
                label="Dirección"
                value={direccion}
                setValue={setDireccion}
                horizontal
                fullWidth
            />
        </div>
        <p className="w-full border-b-1 border-slate-300 my-4 pb-2 text-md font-semibold text-center">Destinatario</p>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleSelector
                label="Tipo de Documento"
                options={ALL_DOCUMENTS_OPTIONS}
                defaultValue={tipoDocumentoDest}
                setter={setTipoDocumentoDest}
            />
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleInput
                label="Número de Documento"
                value={documentoDest}
                setValue={setDocumentoDest}
                horizontal
            />
        </div>
        <div className="grid grid-cols-1 gap-4 my-4">
            <SimpleInput
                label="Destinatario"
                value={destinatario}
                setValue={setDestinatario}
                horizontal
                fullWidth
            />
        </div>
        <div className="grid grid-cols-1 gap-4 my-4">
            <SimpleInput
                label="Dirección"
                value={direccionDest}
                setValue={setDireccionDest}
                horizontal
                fullWidth
            />
        </div>
        <div className="w-full flex justify-center items-center gap-4 col-span-2">
            <p className="pl-2 block text-xs font-semibold text-slate-700">Ubigeo</p>
            <SearchableDropdownInput
                options={[...ubigeos.map(ubi => ({ id: ubi.coddis, label: `${ubi.nomdpto} - ${ubi.nomprov} - ${ubi.nomdis}` }))]}
                selected={ubigeo}
                setSelected={setUbigeo}
                placeholder="Buscar Ubigeo"
                required
            />
        </div>
        <p className="w-full border-b-1 border-slate-300 my-4 pb-2 text-md font-semibold text-center">Diligencia</p>
        <div className="grid grid-cols-2 gap-4 my-4">
            <div className="grid grid-cols-3 items-center gap-2">
                <p className="pl-2 block text-xs font-semibold text-slate-700">Fecha de Diligencia</p>
                <Calendar
                    selectedDate={fechaDiligencia}
                    setSelectedDate={setFechaDiligencia}   
                />
            </div>
            <div className="flex items-center justify-end w-[40%] gap-2">
                <TimePicker
                    selectedTime={horaDiligencia}
                    setSelectedTime={setHoraDiligencia}
                />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4 my-4">
            <SimpleSelectorStr
                label="Responsable"
                options={usuarios.map(user => ({ value: user.loginusuario, label: `${user.prinom} ${user.apepat}` }))}
                defaultValue={responsible}
                setter={setResponsible}
            />
            <SimpleSelectorStr
                label="Firma"
                options={[
                    { value: 'si', label: 'Sí' },
                    { value: 'no', label: 'No' },
                ]}
                defaultValue={firma}
                setter={setFirma}
            />
        </div>
        <div className="flex gap-4 justify-center items-center my-4">
            <p className="pl-2 text-xs font-semibold text-slate-700">Recepción</p>
            <textarea
                value={recepcion}
                onChange={(e) => setRecepcion(e.target.value)}
                placeholder="Contenido de la carta"
                className="w-full h-32 p-2 border border-slate-300 rounded"
            />
        </div>
        <div className="flex gap-4 justify-center items-center my-4">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-end gap-2">
                    <p className="text-xs font-semibold text-slate-700">Contenido</p>
                    <button
                        onClick={() => setOpenSellos(true)}
                    >
                        <MessageCircleQuestionIcon className="w-4 h-4 text-blue-600 hover:text-blue-500 cursor-pointer transition-all duration-300" />
                    </button>
                </div>
                <div className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
                    <p className="text-xs">Actualizar</p>
                </div>
            </div>
            <textarea
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder="Contenido de la carta"
                className="w-full h-32 p-2 border border-slate-300 rounded"
            />
        </div>
    </div>
    <TopModal
        isOpen={openSellos}
        onClose={() => setOpenSellos(false)}
    >
        <div>
            <SellosMain 
                setContenido={setContenido}
                setOpenSellos={setOpenSellos}
            />
        </div>
    </TopModal>
    </>
  )
}

export default CartasNotarialesForm