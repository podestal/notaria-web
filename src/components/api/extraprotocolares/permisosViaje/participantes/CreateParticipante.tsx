import { File } from "lucide-react";
import { useState } from "react";
import TopModal from "../../../../ui/TopModal";
import ParticipantesForm from "./ParticipantesForm";
import useCreateContratante from "../../../../../hooks/api/extraprotocolares/permisosViaje/contratantes/useCreateContratante";
import useGetUbigeos from "../../../../../hooks/api/ubigeo/useGetUbigeos";
import useGetNacionalidades from "../../../../../hooks/api/nacionalidades/useGetNacionalidades";
import PreParticipanteForm from "./PreParticipanteForm";

interface Props {
    viajeId: number;
    participantesDocs: string[];
}

const CreateParticipante = ({ viajeId, participantesDocs }: Props) => {

    const [open, setOpen] = useState(false);
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
        nacionalidad: ''
    });

    const { data: ubigeos, isLoading: isLoadingUbigeos, isError: isErrorUbigeo, isSuccess: isSuccessUbigeo } = useGetUbigeos()
    const { data: nacionalidades, isLoading: isNacionalidadesLoading, isError: isNacionalidadesError, isSuccess: nacionalidadesSuccess } = useGetNacionalidades()

    if (isNacionalidadesLoading || isLoadingUbigeos) return <p className="animate-pulse text-center text-xs my-6">Cargando...</p>

    if (isNacionalidadesError || isErrorUbigeo) return <p className="text-red-500 text-center text-xs my-6">Error al cargar info</p>

    if (nacionalidadesSuccess && isSuccessUbigeo)

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
                   document={document}
                   setContratanteInfo={setContratanteInfo}
                   contratanteInfo={{
                     ...contratanteInfo,
                     estadoCivil: contratanteInfo.estadoCivil === '' ? 0 : Number(contratanteInfo.estadoCivil)
                   }}
                />
            </div>
        </TopModal>
    </>
  )
}

export default CreateParticipante