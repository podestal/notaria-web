import { useState } from "react";
import useGetNacionalidades from "../../../../../hooks/api/nacionalidades/useGetNacionalidades";
import useGetUbigeos from "../../../../../hooks/api/ubigeo/useGetUbigeos";
import PreSolicitanteForm from "./PreSolicitanteForm"
import SolicitanteForm from "./SolicitanteForm"

interface Props {
    solicitante: string;
    domicilio: string;
    distrito: string;
    profesion: string;
    estadoCivil: string;
    genero: string;
    setSolicitante: React.Dispatch<React.SetStateAction<string>>;
    setDomicilio: React.Dispatch<React.SetStateAction<string>>;
    setDistrito: React.Dispatch<React.SetStateAction<string>>;
    setProfesion: React.Dispatch<React.SetStateAction<string>>;
    setEstadoCivil: React.Dispatch<React.SetStateAction<string>>;
    setGenero: React.Dispatch<React.SetStateAction<string>>;
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
    setGenero
}: Props) => {

    const [showSolicitanteForm, setShowSolicitanteForm] = useState(false);

    const { data: ubigeos, isLoading: isLoadingUbigeos, isError: isErrorUbigeo, isSuccess: isSuccessUbigeo } = useGetUbigeos()
    const { data: nacionalidades, isLoading: isNacionalidadesLoading, isError: isNacionalidadesError, isSuccess: nacionalidadesSuccess } = useGetNacionalidades()

    if (isNacionalidadesLoading || isLoadingUbigeos) return <p className="animate-pulse text-center text-xs my-6">Cargando...</p>

    if (isNacionalidadesError || isErrorUbigeo) return <p className="text-red-500 text-center text-xs my-6">Error al cargar info</p>

    if (nacionalidadesSuccess && isSuccessUbigeo)

  return (
    <>
        <PreSolicitanteForm 
            setSolicitante={setSolicitante}
            setDomicilio={setDomicilio}
            setDistrito={setDistrito}
            setProfesion={setProfesion}
            setEstadoCivil={setEstadoCivil}
            setGenero={setGenero}
            setShowSolicitanteForm={setShowSolicitanteForm}
        />
        {showSolicitanteForm && 
        <SolicitanteForm 
            solicitante={solicitante}
            setSolicitante={setSolicitante}
            domicilio={domicilio}
            setDomicilio={setDomicilio}
            distrito={distrito}
            setDistrito={setDistrito}
            profesion={profesion}
            setProfesion={setProfesion}
            estadoCivil={estadoCivil}
            setEstadoCivil={setEstadoCivil}
            genero={genero}
            setGenero={setGenero}
            ubigeos={ubigeos}
            nacionalidades={nacionalidades}
        />}
    </>
  )
}

export default SolicitanteMain