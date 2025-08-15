import { useState } from "react";
import useGetNacionalidades from "../../../../../hooks/api/nacionalidades/useGetNacionalidades";
import useGetProfesiones from "../../../../../hooks/api/profesiones/useGetProfesiones";
import useGetUbigeos from "../../../../../hooks/api/ubigeo/useGetUbigeos";
import TopModal from "../../../../ui/TopModal";
import PreSolicitanteForm from "./PreSolicitanteForm"
import SolicitanteForm from "./SolicitanteForm"
import useGetCargos from "../../../../../hooks/api/cargos/useGetCargos";
import NuevoClienteForm from "./NuevoClienteForm";

interface Props {
    solicitante: string;
    domicilio: string;
    distrito: string;
    profesion: string;
    estadoCivil: number;
    genero: string;
    setSolicitante: React.Dispatch<React.SetStateAction<string>>;
    setDomicilio: React.Dispatch<React.SetStateAction<string>>;
    setDistrito: React.Dispatch<React.SetStateAction<string>>;
    setProfesion: React.Dispatch<React.SetStateAction<string>>;
    setEstadoCivil: React.Dispatch<React.SetStateAction<number>>;
    setGenero: React.Dispatch<React.SetStateAction<string>>;
    selectedTipoDocumento: number;
    setSelectedTipoDocumento: React.Dispatch<React.SetStateAction<number>>;
    document: string;
    setDocument: React.Dispatch<React.SetStateAction<string>>;
}
const SolicitanteMain = ({
    solicitante,
    domicilio, 
    distrito, 
    profesion, 
    estadoCivil, 
    genero, 
    setSolicitante, 
    setDomicilio, 
    setDistrito, 
    setProfesion, 
    setEstadoCivil, 
    setGenero,
    selectedTipoDocumento,
    setSelectedTipoDocumento,
    document,
    setDocument
}: Props) => {

    const [isOpen, setIsOpen] = useState(false);

    const { data: ubigeos, isLoading: isLoadingUbigeos, isError: isErrorUbigeo, isSuccess: isSuccessUbigeo } = useGetUbigeos()
    const { data: nacionalidades, isLoading: isNacionalidadesLoading, isError: isNacionalidadesError, isSuccess: nacionalidadesSuccess } = useGetNacionalidades()
    const { data: profesiones, isLoading: isProfesionesLoading, isError: isProfesionesError, isSuccess: isProfesionesSuccess } = useGetProfesiones()
    const { data: cargos, isLoading: isCargosLoading, isError: isCargosError, isSuccess: isCargosSuccess } = useGetCargos()

    if (isNacionalidadesLoading || isLoadingUbigeos || isProfesionesLoading || isCargosLoading) return <p className="animate-pulse text-center text-xs my-6">Cargando...</p>

    if (isNacionalidadesError || isErrorUbigeo || isProfesionesError || isCargosError) return <p className="text-red-500 text-center text-xs my-6">Error al cargar info</p>

    if (nacionalidadesSuccess && isSuccessUbigeo && isProfesionesSuccess && isCargosSuccess)

  return (
    <>
        <PreSolicitanteForm 
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
            setIsOpen={setIsOpen}
        />
        <SolicitanteForm 
            solicitante={solicitante}
            setSolicitante={setSolicitante}
            domicilio={domicilio}
            setDomicilio={setDomicilio}
            distrito={distrito}
            setDistrito={setDistrito}
            estadoCivil={estadoCivil}
            setEstadoCivil={setEstadoCivil}
            genero={genero}
            setGenero={setGenero}
            ubigeos={ubigeos}
            nacionalidades={nacionalidades}
            profesiones={profesiones}
            profesion={profesion}
            setProfesion={setProfesion}
        />
        <TopModal 
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <NuevoClienteForm 
                ubigeos={ubigeos}
                nacionalidades={nacionalidades}
                profesiones={profesiones}
                cargos={cargos}
                dni={document}
                setSolicitante={setSolicitante}
                setDomicilio={setDomicilio}
                setDistrito={setDistrito}
                setProfesion={setProfesion}
                setEstadoCivil={setEstadoCivil}
                setGenero={setGenero}
                selectedTipoDocumento={selectedTipoDocumento}
                setSelectedTipoDocumento={setSelectedTipoDocumento}
                setDocument={setDocument}
                setOpen={setIsOpen}
            />
        </TopModal>
    </>
  )
}

export default SolicitanteMain