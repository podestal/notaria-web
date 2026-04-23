import { File } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import TopModal from "../../../../ui/TopModal";
import ParticipantesForm from "./ParticipantesForm";
import useCreateContratante from "../../../../../hooks/api/extraprotocolares/permisosViaje/contratantes/useCreateContratante";
import useGetUbigeos from "../../../../../hooks/api/ubigeo/useGetUbigeos";
import useGetNacionalidades from "../../../../../hooks/api/nacionalidades/useGetNacionalidades";
import useGetProfesiones from "../../../../../hooks/api/profesiones/useGetProfesiones";
import useGetCargos from "../../../../../hooks/api/cargos/useGetCargos";
import PreParticipanteForm from "./PreParticipanteForm";
import useAuthStore from "../../../../../store/useAuthStore";
import NuevoClienteForm from "../../AperturaDeLibros/cliente/NuevoClienteForm";

interface Props {
    viajeId: number;
    participantesDocs: string[];
}

const CreateParticipante = ({ viajeId, participantesDocs }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''

    const [open, setOpen] = useState(false);
    const [openCreateCliente, setOpenCreateCliente] = useState(false);
    const [document, setDocument] = useState('');
    const createContratante = useCreateContratante({ viaje_id: viajeId });
    const [contratanteInfo, setContratanteInfo] = useState({
        apePaterno: '',
        apeMaterno: '',
        priNombre: '',
        segNombre: '',
        direccion: '',
        ubigeo: '',
        estadoCivil: '',
        genero: '',
        nacionalidad: '',
        email: '',
        telfijo: '',
        telcel: '',
        telofi: '',
        idprofesion: 0,
        idcargoprofe: 0,
        detaprofesion: '',
        cumpclie: '',
        resedente: '1',
    });

    const { data: ubigeos, isLoading: isLoadingUbigeos, isError: isErrorUbigeo } = useGetUbigeos({ access })
    const { data: nacionalidades, isLoading: isNacionalidadesLoading, isError: isNacionalidadesError } = useGetNacionalidades({ access })
    const { data: profesiones, isLoading: isLoadingProfesiones, isError: isErrorProfesiones } = useGetProfesiones({ access })
    const { data: cargos, isLoading: isLoadingCargos, isError: isErrorCargos } = useGetCargos({ access })

    if (isNacionalidadesLoading || isLoadingUbigeos || isLoadingProfesiones || isLoadingCargos) return <p className="animate-pulse text-center text-xs my-6">Cargando...</p>

    if (isNacionalidadesError || isErrorUbigeo || isErrorProfesiones || isErrorCargos) return <p className="text-red-500 text-center text-xs my-6">Error al cargar info</p>

    const syncClienteByDni = async (dni: string) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}cliente/by_dni/?dni=${dni}`,
                {
                    headers: {
                        'Authorization': `JWT ${access}`
                    }
                }
            );
            if (!response.data?.idcliente) return;
            setContratanteInfo({
                apePaterno: response.data.apepat || '',
                apeMaterno: response.data.apemat || '',
                priNombre: response.data.prinom || '',
                segNombre: response.data.segnom || '',
                direccion: response.data.direccion || '',
                ubigeo: response.data.idubigeo || '',
                estadoCivil: response.data.idestcivil || '',
                genero: response.data.sexo || '',
                nacionalidad: response.data.nacionalidad || '',
                email: response.data.email || '',
                telfijo: response.data.telfijo || '',
                telcel: response.data.telcel || '',
                telofi: response.data.telofi || '',
                idprofesion: response.data.idprofesion || 0,
                idcargoprofe: response.data.idcargoprofe || 0,
                detaprofesion: response.data.detaprofesion || '',
                cumpclie: response.data.cumpclie || '',
                resedente: response.data.resedente || '1',
            });
        } catch (error) {
            console.error('Error sincronizando cliente creado:', error);
        }
    };

  return (
    <>
        <div 
            onClick={() => setOpen(true)}
            className="mx-6 w-28 flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
            <File className="text-white text-xl"/>
            <p className="text-xs font-bold">Nuevo</p>
        </div>
        <TopModal 
            isOpen={open} 
            onClose={() => setOpen(false)}
        >
            <div className="p-4">
                <h2 className="text-2xl font-semibold mb-6 text-center">Nuevo Participante</h2>
                <PreParticipanteForm 
                    setContratanteInfo={setContratanteInfo as React.Dispatch<React.SetStateAction<any>>} 
                    onClienteNotFound={(prefill) => {
                        setContratanteInfo(prev => ({
                            ...prev,
                            apePaterno: prefill.apePaterno,
                            apeMaterno: prefill.apeMaterno,
                            priNombre: prefill.priNombre,
                            segNombre: prefill.segNombre,
                            genero: prefill.genero,
                        }));
                        setOpenCreateCliente(true);
                    }}
                    setDocument={setDocument}
                    document={document}
                    participantesDocs={participantesDocs}
                />
                <ParticipantesForm 
                   createContratante={createContratante}
                   setDocument={setDocument}
                   idViaje={viajeId}
                   setOpen={setOpen}
                   ubigeos={ubigeos}
                   nacionalidades={nacionalidades}
                   profesiones={profesiones}
                   document={document}
                   setContratanteInfo={setContratanteInfo}
                   contratanteInfo={{
                     ...contratanteInfo,
                     estadoCivil: contratanteInfo.estadoCivil === '' ? 0 : Number(contratanteInfo.estadoCivil)
                   }}
                />
            </div>
        </TopModal>
        <TopModal
            isOpen={openCreateCliente}
            onClose={() => setOpenCreateCliente(false)}
        >
            <NuevoClienteForm
                selectedTipoPersona={1}
                ubigeos={ubigeos}
                nacionalidades={nacionalidades}
                profesiones={profesiones}
                cargos={cargos}
                document={document}
                setDocument={setDocument}
                setApellidoPaterno={(value) => {
                    setContratanteInfo(prev => ({ ...prev, apePaterno: value }));
                }}
                setApellidoMaterno={(value) => {
                    setContratanteInfo(prev => ({ ...prev, apeMaterno: value }));
                }}
                setPrimerNombre={(value) => {
                    setContratanteInfo(prev => ({ ...prev, priNombre: value }));
                }}
                setSegundoNombre={(value) => {
                    setContratanteInfo(prev => ({ ...prev, segNombre: value }));
                }}
                setDireccion={(value) => {
                    setContratanteInfo(prev => ({ ...prev, direccion: value }));
                    setOpenCreateCliente(false);
                    if (document) {
                        syncClienteByDni(document);
                    }
                }}
                setRazonSocial={() => {}}
                setDomicilioFiscal={() => {}}
            />
        </TopModal>
    </>
  )
}

export default CreateParticipante