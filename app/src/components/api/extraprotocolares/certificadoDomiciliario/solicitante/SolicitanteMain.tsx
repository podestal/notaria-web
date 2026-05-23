import { useState } from "react";
import useGetNacionalidades from "../../../../../hooks/api/nacionalidades/useGetNacionalidades";
import useGetProfesiones from "../../../../../hooks/api/profesiones/useGetProfesiones";
import useGetUbigeos from "../../../../../hooks/api/ubigeo/useGetUbigeos";
import TopModal from "../../../../ui/TopModal";
import PreSolicitanteForm from "./PreSolicitanteForm"
import SolicitanteForm from "./SolicitanteForm"
import useGetCargos from "../../../../../hooks/api/cargos/useGetCargos";
import NuevoClienteForm from "./NuevoClienteForm";
import useAuthStore from "../../../../../store/useAuthStore";
import UpdateCliente from "../../../clientes/UpdateCliente";
import type { Cliente } from "../../../../../services/api/cliente1Service";
import { applyClienteToSolicitante } from "./applyClienteToSolicitante";

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
    onRequestCloseForm?: () => void;
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
    setDocument,
    onRequestCloseForm,
}: Props) => {
    const handleCloseNuevoCliente = () => {
        setIsOpen(false);
        onRequestCloseForm?.();
    };

    const [isOpen, setIsOpen] = useState(false);
    const [openEditCliente, setOpenEditCliente] = useState(false);
    const [clienteFound, setClienteFound] = useState(false);
    const [cliente1, setCliente1] = useState<Cliente | null>(null);

    const access = useAuthStore(s => s.access_token) || ''

    const solicitanteSetters = {
        setSolicitante,
        setDomicilio,
        setDistrito,
        setProfesion,
        setEstadoCivil,
        setGenero,
    }

    const handleClienteFound = (cliente: Cliente) => {
        setCliente1(cliente)
        setClienteFound(true)
    }

    const handleClienteCleared = () => {
        setClienteFound(false)
        setCliente1(null)
    }

    const handleSetCliente1: React.Dispatch<React.SetStateAction<Cliente | null>> = (value) => {
        setCliente1((prev) => {
            const next = typeof value === "function" ? value(prev) : value
            if (next) {
                applyClienteToSolicitante(next, solicitanteSetters)
                setClienteFound(true)
            }
            return next
        })
    }

    const openClienteEditor = () => {
        if (!cliente1?.idcliente) return
        setOpenEditCliente(true)
    }

    const { data: ubigeos, isLoading: isLoadingUbigeos, isError: isErrorUbigeo, isSuccess: isSuccessUbigeo } = useGetUbigeos({ access })
    const { data: nacionalidades, isLoading: isNacionalidadesLoading, isError: isNacionalidadesError, isSuccess: nacionalidadesSuccess } = useGetNacionalidades({ access })
    const { data: profesiones, isLoading: isProfesionesLoading, isError: isProfesionesError, isSuccess: isProfesionesSuccess } = useGetProfesiones({ access })
    const { data: cargos, isLoading: isCargosLoading, isError: isCargosError, isSuccess: isCargosSuccess } = useGetCargos({ access })

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
            clienteFound={clienteFound}
            onClienteFound={handleClienteFound}
            onClienteCleared={handleClienteCleared}
            onOpenUpdateCliente={openClienteEditor}
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
            onClose={handleCloseNuevoCliente}
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
        <TopModal
            isOpen={openEditCliente}
            onClose={() => setOpenEditCliente(false)}
            deepth={50}
        >
            {cliente1 && (
                <UpdateCliente
                    dni={document}
                    cliente1={cliente1}
                    setCliente1={handleSetCliente1}
                    setShowClienteForm={setOpenEditCliente}
                    setShowContratanteForm={() => {}}
                    selectedTipoDocumento={cliente1.idtipdoc ?? selectedTipoDocumento}
                    selectedTipoPersona={cliente1.tipper === "J" ? 2 : 1}
                />
            )}
        </TopModal>
    </>
  )
}

export default SolicitanteMain
