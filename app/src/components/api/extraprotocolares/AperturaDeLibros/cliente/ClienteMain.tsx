
import { useState } from "react"
import ClienteForm from "./ClienteForm"
import PreClienteForm from "./PreClienteForm"
import TopModal from "../../../../ui/TopModal"
import useGetNacionalidades from "../../../../../hooks/api/nacionalidades/useGetNacionalidades"
import useGetProfesiones from "../../../../../hooks/api/profesiones/useGetProfesiones"
import useGetCargos from "../../../../../hooks/api/cargos/useGetCargos"
import useGetUbigeos from "../../../../../hooks/api/ubigeo/useGetUbigeos"
import NuevoClienteForm from "./NuevoClienteForm"
import useAuthStore from "../../../../../store/useAuthStore"

interface Props {
    selectedTipoPersona: number
    setSelectedTipoPersona: React.Dispatch<React.SetStateAction<number>>
    document: string
    setDocument: React.Dispatch<React.SetStateAction<string>>
    setApellidoPaterno: React.Dispatch<React.SetStateAction<string>>
    setApellidoMaterno: React.Dispatch<React.SetStateAction<string>>
    setPrimerNombre: React.Dispatch<React.SetStateAction<string>>
    setSegundoNombre: React.Dispatch<React.SetStateAction<string>>
    setDireccion: React.Dispatch<React.SetStateAction<string>>
    apellidoPaterno: string
    apellidoMaterno: string
    primerNombre: string
    segundoNombre: string
    direccion: string
    razonSocial: string
    domicilioFiscal: string
    setRazonSocial: React.Dispatch<React.SetStateAction<string>>
    setDomicilioFiscal: React.Dispatch<React.SetStateAction<string>>
    setCodeCliente: React.Dispatch<React.SetStateAction<string>>
    setDocumentError: React.Dispatch<React.SetStateAction<string>>
    setUbigeo: React.Dispatch<React.SetStateAction<string>>
}

const ClienteMain = ({ 
    selectedTipoPersona, 
    setSelectedTipoPersona, 
    document, 
    setDocument, 
    setApellidoPaterno, 
    setApellidoMaterno, 
    setPrimerNombre, 
    setSegundoNombre, 
    setDireccion, 
    apellidoPaterno, 
    apellidoMaterno, 
    primerNombre, 
    segundoNombre, 
    direccion,
    razonSocial,
    domicilioFiscal,
    setRazonSocial,
    setDomicilioFiscal,
    setCodeCliente,
    setUbigeo,
 }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''

    const [openCreateCliente, setOpenCreateCliente] = useState(false)
    const { data: nacionalidades, isLoading: isNacionalidadesLoading, isError: isNacionalidadesError, isSuccess: nacionalidadesSuccess } = useGetNacionalidades({ access })
    const { data: profesiones, isLoading: isLoadingProfesiones, isError: isErrorProfesiones, isSuccess: isSuccessProfesiones } = useGetProfesiones({ access })
    const { data: cargos, isLoading: isLoadingCargos, isError: isErrorCargos, isSuccess: isSuccessCargos } = useGetCargos({ access })
    const { data: ubigeos, isLoading: isLoadingUbigeos, isError: isErrorUbigeo, isSuccess: isSuccessUbigeo } = useGetUbigeos({ access })

    if (isNacionalidadesLoading || isLoadingProfesiones || isLoadingCargos || isLoadingUbigeos) return <p className="animate-pulse text-center text-xs my-6">Cargando...</p>

    if (isNacionalidadesError || isErrorProfesiones || isErrorCargos || isErrorUbigeo) return <p className="text-red-500 text-center text-xs my-6">Error al cargar info</p>

    if (nacionalidadesSuccess && isSuccessProfesiones && isSuccessCargos && isSuccessUbigeo)
    

  return (
    <>
        <PreClienteForm 
            selectedTipoPersona={selectedTipoPersona}
            setSelectedTipoPersona={setSelectedTipoPersona}
            document={document}
            setDocument={setDocument}
            setApellidoPaterno={setApellidoPaterno}
            setApellidoMaterno={setApellidoMaterno}
            setPrimerNombre={setPrimerNombre}
            setSegundoNombre={setSegundoNombre}
            setDireccion={setDireccion}
            setRazonSocial={setRazonSocial}
            setDomicilioFiscal={setDomicilioFiscal}
            setCodeCliente={setCodeCliente}
            setUbigeo={setUbigeo}
            setOpenCreateCliente={setOpenCreateCliente}
        />
        <ClienteForm 
            tipoPersona={selectedTipoPersona}
            apellidoPaterno={apellidoPaterno}
            apellidoMaterno={apellidoMaterno}
            primerNombre={primerNombre}
            segundoNombre={segundoNombre}
            direccion={direccion}
            setApellidoPaterno={setApellidoPaterno}
            setApellidoMaterno={setApellidoMaterno}
            setPrimerNombre={setPrimerNombre}
            setSegundoNombre={setSegundoNombre}
            setDireccion={setDireccion}
            razonSocial={razonSocial}
            domicilioFiscal={domicilioFiscal}
            setRazonSocial={setRazonSocial}
            setDomicilioFiscal={setDomicilioFiscal}
        />
        <TopModal
            isOpen={openCreateCliente}
            onClose={() => setOpenCreateCliente(false)}
        >
            <NuevoClienteForm 
                selectedTipoPersona={selectedTipoPersona}
                ubigeos={ubigeos}
                nacionalidades={nacionalidades}
                profesiones={profesiones}
                cargos={cargos}
                document={document}
                setDocument={setDocument}
                setApellidoPaterno={setApellidoPaterno}
                setApellidoMaterno={setApellidoMaterno}
                setPrimerNombre={setPrimerNombre}
                setSegundoNombre={setSegundoNombre}
                setDireccion={setDireccion}
                setRazonSocial={setRazonSocial}
                setDomicilioFiscal={setDomicilioFiscal}
            />
        </TopModal>
    </>
  )
}

export default ClienteMain